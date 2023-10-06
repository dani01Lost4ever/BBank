import * as XLSX from "xlsx";

export class exportTable {
  public exportArray(Headers: string[], Data: any[], ext: "xlsx" | "csv") {
    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.aoa_to_sheet([]);

    XLSX.utils.book_append_sheet(workbook, worksheet);

    XLSX.utils.sheet_add_aoa(worksheet, [Headers], { origin: 'A1' });
    let number = 2
    Data.forEach(arr => {
        XLSX.utils.sheet_add_aoa(worksheet, [arr], { origin: `A${number}` });
        number = number + 1;
    })

    XLSX.writeFile(workbook, `transazioni.${ext}`);
  }
}
