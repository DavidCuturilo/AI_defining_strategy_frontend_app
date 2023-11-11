import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { SavedTacticsService } from './saved-tactics.service';
import { Strategy } from '../models/request/generate-strategy.request.dto';
import { SavedTacticsResponseDto } from '../models/response/saved-tactics.response.dto';

@Component({
  selector: 'app-saved-tactics',
  templateUrl: './saved-tactics.component.html',
  styleUrls: ['./saved-tactics.component.scss'],
})
export class SavedTacticsComponent implements OnInit{
  strategyDocuments: {
    id?: number;
    name: string;
    content: string;
    opponentClub: string;
    club: string;
    type: Strategy;
  }[];
  userId = 1;
  strategyByClubs: { club: string, strategy: SavedTacticsResponseDto[] }[];

  strategies: { imagePath: string, details: string}[] = [
    { imagePath: "../../assets/strategy_icons/attack.png", details: "Offensive" },
    { imagePath: "../../assets/strategy_icons/defense.png", details: "Defensive" },
    { imagePath: "../../assets/strategy_icons/specific strategy.png", details: "Specific" },
    { imagePath: "../../assets/strategy_icons/include all.png", details: "Overall" },
  ]

  constructor(private readonly savedTacticsService: SavedTacticsService) { }

  async ngOnInit() {
    this.strategyDocuments = await this.savedTacticsService.getSavedTactics(this.userId);

    this.strategyByClubs = [];

    this.strategyDocuments.forEach((strategy) => {
      const index = this.strategyByClubs.findIndex((club) => club.club === strategy.club);
      if (index === -1) {
        this.strategyByClubs.push({ club: strategy.club, strategy: [strategy] });
      } else {
        this.strategyByClubs[index].strategy.push(strategy);
      }
    });
  }

  downloadPdf(documentId: number) {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const document = this.strategyDocuments.find((strategy) => strategy.id === documentId);
    const title = `${document.opponentClub} Strategy Guide`;
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;

    doc.text(title, titleX, 20);
    const text = document.content;
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
    doc.save(`${document.name}.pdf`);
  }

  async remove(documentId: number) {
    await this.savedTacticsService.removeStrategy(documentId);
    this.strategyDocuments = this.strategyDocuments.filter(
      (strategy) => strategy.id !== documentId
    );
    this.ngOnInit();
  }
}
