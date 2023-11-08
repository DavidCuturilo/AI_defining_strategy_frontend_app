import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, map, startWith } from 'rxjs';
import { ToastService } from '../auth/toast.service';
import jsPDF from 'jspdf';
import { StrategyService } from './strategy.service';
import {
  GenerateStrategyRequestDto,
  Strategy,
} from '../models/request/generate-strategy.request.dto';
import { SaveStrategyRequestDto } from '../models/request/save-strategy.request.dto';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss'],
})
export class StrategyComponent implements OnInit {
  constructor(private readonly strategyService: StrategyService) {}
  strategyForm = new FormGroup({
    league: new FormControl('Premier League', Validators.required),
    club: new FormControl('', Validators.required),
    opponentClub: new FormControl('', Validators.required),
  });
  private readonly toastService = inject(ToastService);
  clubs: string[] = [
    'Arsenal',
    'Chelsea',
    'Manchester City',
    'Manchester United',
    'Liverpool',
    'Aston Villa',
    'Tottenham Hotspur',
    'Everton',
    'Newcastle United',
    'Fulham',
    'West Ham United',
    'Crystal Palace',
    'Wolverhampton Wanderers',
    'Brighton & Hove Albion',
    'Bournemouth',
    'Brentford',
    'Nottingham Forest',
    'Burnley',
    'Sheffield United',
    'Luton Town',
  ];
  opponentClubs: string[] = [
    'Arsenal',
    'Chelsea',
    'Manchester City',
    'Manchester United',
    'Liverpool',
    'Aston Villa',
    'Tottenham Hotspur',
    'Everton',
    'Newcastle United',
    'Fulham',
    'West Ham United',
    'Crystal Palace',
    'Wolverhampton Wanderers',
    'Brighton & Hove Albion',
    'Bournemouth',
    'Brentford',
    'Nottingham Forest',
    'Burnley',
    'Sheffield United',
    'Luton Town',
  ];
  documents = [
    // { name: `Attack strategy`, content: 'Created Strategy' },
    // { name: `Defense strategy`, content: 'Created Strategy' },
  ];

  creatingStrategy = false;
  opponentClub = 'Arsenal';
  strategy;

  //* Checkbox
  strategyChoices = [
    { name: 'Attack', completed: false },
    { name: 'Defense', completed: false },
    { name: 'Specific strategy', completed: false },
    { name: 'Include all', completed: false },
  ];
  desiredStrategy = [];

  addCheckBoxValue(value, event: MatCheckboxChange) {
    if (event.checked) {
      this.desiredStrategy.push(value);
    } else if (this.desiredStrategy.includes(value)) {
      this.desiredStrategy = this.desiredStrategy.filter(
        (strategy) => strategy != value
      );
    }
  }

  //* autocomplete
  clubFilteredOptions: Observable<string[]>;
  opponentClubFilteredOptions: Observable<string[]>;

  ngOnInit(): void {
    this.clubFilteredOptions = this.strategyForm.get('club').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterClubs(value || ''))
    );

    this.opponentClubFilteredOptions = this.strategyForm
      .get('opponentClub')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterOpponentsClub(value || ''))
      );
  }

  private _filterClubs(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.clubs.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterOpponentsClub(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.opponentClubs.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  //* Strategy
  async generateStrategy() {
    if (this.strategyForm.invalid || this.desiredStrategy.length == 0) {
      this.toastService.showErrorToast(`All fields needs to be fulfilled!`);
      return;
    }
    if (
      this.strategyForm.get('club').value ==
      this.strategyForm.get('opponentClub').value
    ) {
      this.toastService.showErrorToast(
        `Opponent club can not be the same as yours!`
      );
      return;
    }
    this.opponentClub = this.strategyForm.get('opponentClub').value;
    const data = this.strategyForm.value;
    this.strategy = [...this.desiredStrategy];
    if (this.desiredStrategy.includes(Strategy.INCLUDE_ALL)) {
      this.strategy = [
        Strategy.ATTACK,
        Strategy.DEFENSE,
        Strategy.SPECIFIC_STRATEGY,
      ];
    }
    data['desiredStrategy'] = this.strategy;

    this.creatingStrategy = true;

    const response = await this.strategyService.generateStrategy(
      data as GenerateStrategyRequestDto
    );
    this.documents.push({
      name: `Competitive strategy against ${this.opponentClub}`,
      content: response.message,
      type: data['desiredStrategy']
    });
    this.creatingStrategy = false;
  }

  downloadPdf(content: string) {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const title = `${this.opponentClub} Strategy Guide`;
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;

    doc.text(title, titleX, 20);
    const text = content;
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(15);

    let cursor = 40;
    let lines = doc.splitTextToSize(
      text,
      doc.internal.pageSize.width - 2 * margin
    );

    lines.forEach((line) => {
      if (cursor > pageHeight - margin) {
        doc.addPage();
        cursor = margin;
      }
      // Add the line to the document
      line = line.replace(/\*(.*?)\*/g, '<b>$1</b>');
      doc.html(line, { margin: [10, 10] });
      doc.text(line, margin, cursor, { align: 'justify' });

      cursor += lineHeight;
    });
    // Save the PDF
    doc.save(`${this.opponentClub}_competitive_strategy.pdf`);
  }

  async saveStrategy(index: number) {
    const strategyToSave: SaveStrategyRequestDto = {
      name: this.documents[index].name,
      content: this.documents[index].content,
      type: this.documents[index].type,
      opponentClub: this.opponentClub,
      club: this.strategyForm.get('club').value,
      userId: 1,
    };

    try {
      await this.strategyService.saveStrategy(strategyToSave);
      this.toastService.showSuccessToast(`Strategy successfully saved!`);
    } catch (error) {
      this.toastService.showErrorToast(`Error while saving strategy!`);
    }
  }
}
