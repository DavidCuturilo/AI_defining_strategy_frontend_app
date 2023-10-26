import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, map, startWith } from 'rxjs';
import { ToastService } from '../auth/toast.service';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import { StrategyService } from './strategy.service';
import {
  GenerateStrategyRequestDto,
  Strategy,
} from '../models/request/generate-strategy.request.dto';

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
  opponentClub;
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
    //   const text = `
    // Crystal Palace Strengths:

    // Counter-Attacking Play: Crystal Palace is known for their ability to quickly transition from defense to offense, making them dangerous on the counter-attack.
    // Set Pieces: They have shown proficiency in set pieces, particularly in delivering and finishing from corners and free kicks.
    // Physicality: Crystal Palace tends to have physically imposing players, especially in defense and midfield.

    // Crystal Palace Weaknesses:

    // Defensive Vulnerabilities: They can sometimes struggle with defending against fast-paced attacks and intricate passing play.
    // Aerial Vulnerabilities: Despite their physicality, they can be susceptible to well-executed aerial attacks.
    // Midfield Pressing: Their midfield can sometimes struggle with pressing high up the pitch.

    // Competitive Strategy:

    // Offense:

    // Quick Transitions: Given Crystal Palace's strength in counter-attacks, it's essential to maintain possession when in their half and be organized in transition from defense to offense.

    // Exploit Width: Crystal Palace may struggle with wide play, so utilize your wingers to stretch their defense and deliver crosses into the box.

    // Attacking Midfielders: Use creative and agile midfielders to exploit spaces between their defense and midfield. Look for incisive through balls and shots from distance.

    // Set Piece Training: Focus on defensive and offensive set piece training. This will help neutralize their strength and potentially exploit their vulnerabilities.

    // Defense:

    // Solid Defensive Structure: Maintain a compact defensive shape to limit Crystal Palace's options in the final third. Be organized and communicate effectively.

    // Aerial Dominance: Given their vulnerability in the air, prioritize strong aerial defenders and midfielders. Train set-piece defending to minimize their threat.

    // Pressing Midfield: Apply selective high pressing in the midfield to disrupt their build-up play. Force them into making hurried decisions.

    // Quick Recovery: Emphasize quick recovery when possession is lost. This will help nullify their counter-attacking opportunities.

    // Specialized Tactics:

    // Exploit Flanks: Target the areas around their full-backs, particularly if they have any defensive weaknesses in those positions.

    // Man-Marking Key Players: Identify their key playmakers and consider employing man-marking to limit their influence on the game.

    // Scout Individual Weaknesses: If there are specific players in the Crystal Palace squad with known vulnerabilities, exploit them through targeted attacks.

    // Remember, the effectiveness of any strategy can be influenced by real-time factors such as player form, injuries, and tactical adjustments made by the opposing team. Always stay flexible and be prepared to adapt your approach during the match. Good luck with your game against Crystal Palace!
    // `;

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
}
