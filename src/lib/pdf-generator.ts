import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function generatePDF(element: HTMLElement, filename: string) {
  try {
    // Configurações para melhor qualidade
    const canvas = await html2canvas(element, {
      scale: 2, // Maior resolução
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")

    // Calcular dimensões do PDF
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    console.log(canvas.height)
    const imgHeight = Math.floor((canvas.height * imgWidth) / canvas.width); // Remove decimals
    console.log(imgHeight)
    let heightLeft = imgHeight

    // Criar PDF
    const pdf = new jsPDF("p", "mm", "a4")
    let position = 0

    // Adicionar primeira página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight

    // Adicionar páginas extras se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    // Baixar o PDF
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error("Erro ao gerar PDF:", error)
    throw error
  }
}
