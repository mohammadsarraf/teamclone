export const getSliderBackground = (value: number, max: number) => {
  const percentage = (value / max) * 100;
  return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
}; 