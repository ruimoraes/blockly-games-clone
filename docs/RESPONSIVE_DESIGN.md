# Sistema de Design Responsivo

Este documento descreve o sistema de design responsivo implementado na aplicação Blockly Games Clone.

## 📱 Breakpoints

O sistema utiliza os breakpoints padrão do Bootstrap 5:

```javascript
{
  xs: 0,      // Extra small devices (portrait phones)
  sm: 576,    // Small devices (landscape phones)  
  md: 768,    // Medium devices (tablets)
  lg: 992,    // Large devices (desktops)
  xl: 1200,   // Extra large devices (large desktops)
  xxl: 1400   // Extra extra large devices (larger desktops)
}
```

## 🎨 Design System

### Variáveis CSS

```css
:root {
  /* Gradientes */
  --primary-gradient: linear-gradient(135deg, #ED1B2F 0%, #ED0973 50%, #B624C0 100%);
  --secondary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* Sombras */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.16);
  
  /* Efeito Glass */
  --glass-light: rgba(255, 255, 255, 0.15);
  --glass-dark: rgba(0, 0, 0, 0.15);
  
  /* Transições */
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

### Tipografia Responsiva

Utilizamos a função `clamp()` para criar tipografia que se adapta ao viewport:

```css
.display-responsive {
  font-size: clamp(2rem, 5vw, 4rem);
}

.lead-responsive {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
}
```

## 🧩 Componentes

### ResponsiveLayout

Componente principal para layout das páginas com gradientes e padrões de fundo.

```jsx
<ResponsiveLayout backgroundGradient="primary">
  {/* Conteúdo da página */}
</ResponsiveLayout>
```

### ResponsiveCard

Cards com efeito glass morphism e animações.

```jsx
<ResponsiveCard variant="glass" hover={true} animation={false}>
  <ResponsiveCard.Body>
    {/* Conteúdo do card */}
  </ResponsiveCard.Body>
</ResponsiveCard>
```

### GameCard

Componente especializado para exibir informações de jogos de forma responsiva.

```jsx
<GameCard game={gameObject} />
```

### ResponsiveGrid

Sistema de grid otimizado com espaçamento responsivo.

```jsx
<ResponsiveGrid spacing="default" justify="center">
  <ResponsiveCol xs={12} md={6} lg={4}>
    {/* Conteúdo */}
  </ResponsiveCol>
</ResponsiveGrid>
```

## 🎯 Hooks Responsivos

### useResponsive

Hook principal para detectar o estado responsivo atual.

```jsx
const { 
  screenSize, 
  breakpoint, 
  isMobile, 
  isTablet, 
  isDesktop 
} = useResponsive();
```

### useResponsiveClasses

Hook para aplicar classes CSS condicionalmente baseado no breakpoint.

```jsx
const { getResponsiveClass } = useResponsiveClasses();

const className = getResponsiveClass(
  'mobile-class',    // Mobile
  'tablet-class',    // Tablet  
  'desktop-class'    // Desktop
);
```

### useResponsiveAnimations

Hook para controlar animações respeitando preferências de acessibilidade.

```jsx
const { getTransition, shouldReduceMotion } = useResponsiveAnimations();
```

## 📱 Otimizações Mobile

### Touch-friendly

- Botões com tamanho mínimo de 44px
- Espaçamento adequado entre elementos clicáveis
- Desabilitação de hover em dispositivos touch

### Performance

- Animações reduzidas em dispositivos móveis
- Lazy loading de imagens
- Otimização de rendering com `transform` e `opacity`

### Acessibilidade

- Suporte a `prefers-reduced-motion`
- Alto contraste em `prefers-contrast: high`
- Foco visível em todos os elementos interativos

## 🎨 Classes Utilitárias

### Efeitos Visuais

```css
.glass-card           /* Efeito glass morphism claro */
.glass-card-dark      /* Efeito glass morphism escuro */
.hover-lift           /* Animação de elevação no hover */
.floating-card        /* Animação flutuante contínua */
.gradient-text        /* Texto com gradiente */
```

### Responsividade

```css
.responsive-text      /* Texto responsivo */
.responsive-heading   /* Títulos responsivos */
.responsive-display   /* Display responsivo */
.show-mobile          /* Visível apenas no mobile */
.show-tablet          /* Visível apenas no tablet */
.show-desktop         /* Visível apenas no desktop */
```

### Aspect Ratios

```css
.aspect-square        /* Proporção quadrada */
.aspect-video         /* Proporção 16:9 */
.aspect-photo         /* Proporção 4:3 */
```

## 🔧 Configuração

Todo o sistema é configurado através de arquivos centralizados:

- `src/config/responsive.js` - Breakpoints e configurações
- `src/styles/globals.css` - Variáveis CSS e utilitários
- `src/hooks/useResponsive.js` - Hooks responsivos

## 📦 Uso Básico

```jsx
import {
  ResponsiveLayout,
  ResponsiveCard,
  GameCard,
  useResponsive
} from '../components';

function MyPage() {
  const { isMobile } = useResponsive();
  
  return (
    <ResponsiveLayout>
      <ResponsiveCard variant="glass">
        <h1 className="responsive-heading">
          {isMobile ? 'Título Mobile' : 'Título Desktop'}
        </h1>
      </ResponsiveCard>
    </ResponsiveLayout>
  );
}
```

## 🚀 Próximos Passos

1. **Implementar busca responsiva** com filtros adaptativos
2. **Adicionar mais variações de cards** para diferentes contextos
3. **Criar componente de navegação** responsiva
4. **Implementar lazy loading** para imagens de jogos
5. **Adicionar suporte a PWA** com manifesto responsivo

---

Este sistema foi desenvolvido priorizando:
- ✅ Performance em dispositivos móveis
- ✅ Acessibilidade (WCAG 2.1)
- ✅ Experiência fluida em todos os tamanhos de tela
- ✅ Manutenibilidade e escalabilidade
- ✅ Design moderno com glass morphism
