import React from 'react';

const FluidText = ({ title }) => {
  let initialText = "";
  let lastLetter = "";
  if (title.length > 3) {
    initialText = title.slice(0, -3);
    lastLetter = title.slice(-3);
  } else {
    lastLetter = title;
  }

  const colors = ['#00a34c', '#ff9f00', '#004d85']; // Liste des couleurs
  const duration = 15000; // Durée de l'animation en millisecondes
  const gradientLength = colors.length;

  const generateText = () => {
    const textArray = lastLetter.split('');
    const textLength = textArray.length;
    const keyframes = `@keyframes textAnimation {
      0% { background-position: 0% 0; }
      100% { background-position: 100% 0; }
    }`;

    const gradientStops = textArray.map((_, index) => {
      const colorIndex = index % gradientLength;
      return `${colors[colorIndex]} ${index / (textLength - 1) * 100}% ${(index + 1) / (textLength - 1) * 100}%`;
    });

    const gradient = `linear-gradient(90deg, ${gradientStops.join(', ')})`;

    const style = {
      background: gradient,
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      backgroundSize: '200% 100%',
      animation: 'textAnimation linear infinite',
      animationDuration: `${duration}ms`,
      animationDirection: 'alternate',
      animationTimingFunction: 'linear',
    };

    return (
      <h4 style={style}>
        {lastLetter}
        <style>
          {keyframes}
        </style>
      </h4>
    );
  };

  const colorTextBase =document.documentElement.getAttribute("data-layout-mode") === "dark" ? "#ced4da" :"#004d85";
  console.log("colorTextBase",colorTextBase)
  return (
    <div className='d-flex justify-content-center'>
      <h4 style={{ color: colorTextBase }} className='m-0 p-0'>{initialText}</h4>
      {generateText()}
    </div>
  );
};

export default FluidText;