
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 sm:mb-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        AI Image Upscaler Pro
      </h1>
      <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
        Transform your low-resolution images into high-quality masterpieces with a single click.
      </p>
    </header>
  );
};
