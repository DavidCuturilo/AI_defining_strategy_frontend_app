import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, map, startWith } from 'rxjs';
import { ToastService } from '../auth/toast.service';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import { StrategyService } from './strategy.service';
import { GenerateStrategyRequestDto } from '../models/request/generate-strategy.request.dto';

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
    // { name: `Attack strategy`, content: '' },
    // { name: `Defense strategy`, content: '' },
  ];
  creatingStrategy = false;

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
    const data = this.strategyForm.value;
    data['desiredStrategy'] = this.desiredStrategy;
    console.log(data);

    this.creatingStrategy = true;
    setTimeout(() => {
      this.documents.push({ name: `Attack strategy`, content: '' });
      this.creatingStrategy = false;
    }, 2000);

    const response = await this.strategyService.generateStrategy(data as GenerateStrategyRequestDto);
    console.log(`Response from backend: ${response}`);
  }

  downloadPdf() {
    // Assuming pdfBlob contains the PDF as a Blob
    // const pdfBlob = new Blob([/* PDF content as Uint8Array or ArrayBuffer */], { type: 'application/pdf' });

    // Generate a sample PDF
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    const pdfContent = doc.output('arraybuffer');
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });

    FileSaver.saveAs(pdfBlob, 'your-file-name.pdf');
  }
}
