import React from "react";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button className="btn btn-outline-light mb-4" onClick={onClick}>
      ← Назад
    </button>
  );
};

export default BackButton;