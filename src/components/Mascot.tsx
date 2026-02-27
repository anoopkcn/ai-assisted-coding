import React from 'react';
import styles from './Mascot.module.css';

interface MascotProps {
  src: string;
  alt?: string;
  size?: number;
  position?: 'top-right' | 'top-left';
}

export default function Mascot({
  src,
  alt = 'Page mascot',
  size = 150,
  position = 'top-right',
}: MascotProps) {
  return (
    <div
      className={`${styles.mascot} ${styles[position]}`}
      style={{ width: `${size}px` }}
      aria-hidden="true"
    >
      <img src={src} alt={alt} />
    </div>
  );
}
