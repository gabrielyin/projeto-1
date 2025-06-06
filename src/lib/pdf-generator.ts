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
    const imgHeight = Math.floor((canvas.height * imgWidth) / canvas.width)
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

// Função para gerar PDF e retornar Blob
export async function generatePDFBlob(element: HTMLElement): Promise<Blob> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = Math.floor((canvas.height * imgWidth) / canvas.width)
    let heightLeft = imgHeight

    const pdf = new jsPDF("p", "mm", "a4")
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    // Retorna o Blob do PDF
    return pdf.output("blob")
  } catch (error) {
    console.error("Erro ao gerar PDF Blob:", error)
    throw error
  }
}
