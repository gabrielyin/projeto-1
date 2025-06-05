"use client"

import { Button } from "@/components/ui/button"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const templates = [
  {
    id: "modern",
    name: "Moderno",
    description: "Design com gradiente azul",
    color: "bg-gradient-to-r from-blue-500 to-indigo-500",
  },
  {
    id: "classic",
    name: "Clássico",
    description: "Estilo tradicional âmbar",
    color: "bg-gradient-to-r from-amber-600 to-amber-700",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Layout limpo e simples",
    color: "bg-gradient-to-r from-gray-600 to-gray-700",
  },
  {
    id: "corporate",
    name: "Corporativo",
    description: "Visual profissional",
    color: "bg-gradient-to-r from-slate-600 to-slate-700",
  },
]

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Escolha o Template</h3>
      <div className="flex gap-2">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant={selectedTemplate === template.id ? "default" : "outline"}
            size="sm"
            onClick={() => onTemplateChange(template.id)}
            className="flex flex-col items-center p-3 h-auto flex-1"
          >
            <div className={`w-full h-6 rounded mb-2 ${template.color}`} />
            <div className="text-xs font-medium">{template.name}</div>
          </Button>
        ))}
      </div>
    </div>
  )
}
