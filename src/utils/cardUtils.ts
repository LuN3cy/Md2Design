import type { CardStyle } from '../store';

export const getCardDimensions = (cardStyle: CardStyle) => {
  let width = cardStyle.width || 800;
  let height = cardStyle.height || 600;

  if (cardStyle.aspectRatio !== 'custom' && !cardStyle.autoHeight) {
    const [w, h] = cardStyle.aspectRatio.split(':').map(Number);
    const baseWidth = cardStyle.width || 800;
    
    // Determine dimensions based on orientation and aspect ratio
    if (cardStyle.orientation === 'portrait') {
      width = baseWidth;
      // Swap dimensions if portrait to ensure vertical orientation
      if (w > h) {
         height = width * (w / h);
      } else {
         height = width * (h / w);
      }
    } else {
      // Landscape
      width = baseWidth;
      height = width * (h / w);
    }
  }
  
  return { width, height };
};
