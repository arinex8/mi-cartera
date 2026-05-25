function doGet(e) {
  var data = e.parameter;
  if (data.action === "delete") return eliminar(data);
  return guardar(data);
}
 
function guardar(data) {
  try {
    var ss = SpreadsheetApp.openById("1AWDbbyt3rMhzjjR2Vj0v_QaAuw1Z80uE4L5tbeDvz6M");
    var sheetName = data.sheet || "ENTRADA DATOS";
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
 
    // Columna F = descripcion (nuevo campo)
    sheet.appendRow([
      data.categoria    || "",
      data.subcategoria || "",
      data.persona      || "",
      parseFloat(data.importe) || 0,
      data.fecha        || "",
      data.descripcion  || ""   // ← columna F
    ]);
 
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
 
function eliminar(data) {
  try {
    var ss = SpreadsheetApp.openById("1AWDbbyt3rMhzjjR2Vj0v_QaAuw1Z80uE4L5tbeDvz6M");
    var sheet = ss.getSheetByName("ENTRADA DATOS") || ss.getSheets()[0];
    var rows = sheet.getDataRange().getValues();
 
    var cat = String(data.categoria  || "").trim().toUpperCase();
    var sub = String(data.subcategoria || "").trim().toUpperCase();
    var per = String(data.persona    || "").trim().toUpperCase();
    var imp = parseFloat(data.importe || 0);
 
    // Recorre de abajo arriba para borrar la última coincidencia
    for (var i = rows.length - 1; i >= 0; i--) {
      var rowCat = String(rows[i][0] || "").trim().toUpperCase();
      var rowSub = String(rows[i][1] || "").trim().toUpperCase();
      var rowPer = String(rows[i][2] || "").trim().toUpperCase();
      var rowImp = parseFloat(String(rows[i][3] || "0").replace("€","").replace(",",".").trim());
 
      if (rowCat === cat && rowSub === sub && rowPer === per && rowImp === imp) {
        sheet.deleteRow(i + 1);
        return ContentService
          .createTextOutput(JSON.stringify({ ok: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
 
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
