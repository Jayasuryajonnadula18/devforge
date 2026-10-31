'use client';

import React from 'react';
import './FlowingMenu.css';

export interface FlowingMenuItem {
  text: string;
  link?: string;
  image?: string;
  marquee?: string;
  meta?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export interface FlowingMenuProps {
  items?: FlowingMenuItem[];
  isOpen?: boolean;
  speed?: number;
  direction?: 'left' | 'right' | 'alternate';
  followCursor?: number;
  duration?: number;
  stretch?: number;
  magnet?: number;
  bandInset?: number;
  bandRadius?: number;
  carryContent?: boolean;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  dividers?: boolean;
  dimInactive?: boolean;
  align?: 'center' | 'left';
  showIndex?: boolean;
  showArrow?: boolean;
  imageShape?: 'pill' | 'rounded' | 'circle';
  intro?: boolean;
  activeIndex?: number;
  onItemClick?: (item: FlowingMenuItem, index: number, event: React.MouseEvent) => void;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FlowingMenu({
  items = [],
  isOpen,
  onItemClick,
  ariaLabel = 'Main Navigation',
  className = '',
  style,
}: FlowingMenuProps) {
  return (
    <nav
      className={`flowing-menu-container ${className}`.trim()}
      aria-label={ariaLabel}
      style={style}
    >
      <ul className="flowing-menu__list" role="list">
        {items.map((item, index) => {
          const handleClick = (e: React.MouseEvent) => {
            if (item.onClick) {
              item.onClick(e);
            }
            if (onItemClick) {
              onItemClick(item, index, e);
            }
          };

          const rowContent = (
            <div className="flowing-menu__row">
              {/* Destination Title: Large pristine typography */}
              <span className="flowing-menu__title">
                {item.text}
              </span>

              {/* Carefully cropped horizontal capsule-shaped image strip */}
              {item.image && (
                <div
                  className="flowing-menu__capsule"
                  aria-hidden="true"
                >
                  <div className="flowing-menu__capsule-media">
                    <img
                      src={item.image}
                      alt=""
                      loading="eager"
                      className="flowing-menu__capsule-img"
                    />
                    <div className="flowing-menu__capsule-gradient" />
                  </div>
                </div>
              )}
            </div>
          );

          return (
            <li
              key={`${item.text}-${index}`}
              className="flowing-menu__item"
            >
              {item.link ? (
                <a
                  href={item.link}
                  onClick={handleClick}
                  className="flowing-menu__interactive"
                >
                  {rowContent}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleClick}
                  className="flowing-menu__interactive"
                >
                  {rowContent}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default FlowingMenu;
