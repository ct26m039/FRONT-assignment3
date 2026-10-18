**Prompt:** Kannst du mir bitte auf der Basis unserer definierten Fabrben und Anwendung eine Überischts Strukturieren und schön formatieren? Primary: #850c54 Hauptfarbe, auch für Übershcriften und CTA.
Secondary: #da148a #30041e für Tags und akzentelemente 
Structur Colors:  Hintergrudnkartenfarbe: #dedede Hintergrund Light und Textfarbe #ffffff Textfarbe dunkel: #2d2d2d Darkmode: #212121 
Text Colors: #cccccc #ffffff #2d2d2d 
**Antwort:** * `color-surface-base`: Basis-Hintergrund der App (`#ffffff` im Light Mode, `#212121` im Dark Mode).
* `color-surface-card`: Hintergrund für Karten und Container (`#dedede` im Light Mode, `#2d2d2d` im Dark Mode).
* `color-brand-primary`: Primäre Markenfarbe für Hauptelemente und CTAs (`#850c54` Deep Berry).
* `color-brand-secondary`: Sekundäre Akzentfarbe (`#da148a`). C, Hoveromment: Für Hinweis
* `color-brand-accent`: Zusätzlicher Akzentton (`#30041e`). Comment: Für Tags,Active State
* `color-text-primary`: Haupttextfarbe (`#2d2d2d` im Light Mode, `#ffffff` im Dark Mode).
* `color-text-on-brand`: Textfarbe auf Markenelementen (`#ffffff`)

**Prompt:** Kannst du mir bitte auf Basis von den offizielle W3C Design Tokens Format die Json Struktur ausgeben für die Design Tokens?
**Antwort:** {
  "color": {
    "brand": {
      "primary": {
        "$value": "#850c54",
        "$type": "color",
        "$description": "Primary / Basecolor Deep Berry"
      },
      "secondary": {
        "$value": "#da148a",
        "$type": "color",
        "$description": "Secondary Accent Hot Magenta"
      },
      "accent": {
        "$value": "#30041e",
        "$type": "color",
        "$description": "Dark Aubergine Accent"
      }
    },
    "neutral": {
      "0": {
        "$value": "#ffffff",
        "$type": "color",
        "$description": "Pure White / Light Background"
      },
      "300": {
        "$value": "#cccccc",
        "$type": "color",
        "$description": "Card Background Light Mode"
      },
      "800": {
        "$value": "#2d2d2d",
        "$type": "color",
        "$description": "Text & Dark Mode Cards"
      },
      "900": {
        "$value": "#212121",
        "$type": "color",
        "$description": "Dark Mode Background"
      }
    },
    "surface": {
      "base": {
        "$value": "{color.neutral.0}",
        "$type": "color",
        "$description": "Main background surface in light mode (dynamic for dark mode)"
      },
      "card": {
        "$value": "{color.neutral.300}",
        "$type": "color",
        "$description": "Card background surface in light mode"
      }
    },
    "text": {
      "primary": {
        "$value": "{color.neutral.800}",
        "$type": "color",
        "$description": "Primary text color in light mode"
      },
      "onBrand": {
        "$value": "{color.neutral.0}",
        "$type": "color",
        "$description": "Text color on brand elements"
      }
    }
  },
  "spacing": {
    "xs": {
      "$value": "0.25rem",
      "$type": "dimension"
    },
    "sm": {
      "$value": "0.5rem",
      "$type": "dimension"
    },
    "md": {
      "$value": "1rem",
      "$type": "dimension"
    },
    "lg": {
      "$value": "1.5rem",
      "$type": "dimension"
    },
    "xl": {
      "$value": "2.5rem",
      "$type": "dimension"
    }
  },
  "typography": {
    "fontSize": {
      "sm": {
        "$value": "0.875rem",
        "$type": "dimension"
      },
      "base": {
        "$value": "1rem",
        "$type": "dimension"
      },
      "lg": {
        "$value": "1.25rem",
        "$type": "dimension"
      },
      "xl": {
        "$value": "2rem",
        "$type": "dimension"
      },
      "xxl": {
        "$value": "3rem",
        "$type": "dimension"
      }
    }
  }
}