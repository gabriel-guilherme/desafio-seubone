import React from 'react';
import './index.css';

const InfoSvg = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_8801_2389_header)">
            <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#212121"/>
        </g>
        <defs>
            <clipPath id="clip0_8801_2389_header">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export default function PecaFormHeader({
    isDirty,
    isSubmitting,
    onDiscard,
    onDelete,
    submitError,
    saveButtonText = 'Salvar'
}) {
    return (
        <>
            <div className="peca-form-header">
                <div className="peca-form-status">
                    {isDirty && !isSubmitting && (
                        <>
                            <InfoSvg />
                            <p>Alterações não salvas</p>
                        </>
                    )}
                </div>
                <div className="peca-form-controls">
                    <button
                        type="button"
                        onClick={onDelete}
                        className="peca-form-button excluir"
                        disabled={isSubmitting}
                    >
                        Excluir Peça
                    </button>
                    <button
                        type="button"
                        onClick={onDiscard}
                        className="peca-form-button descartar"
                        disabled={isSubmitting}
                    >
                        Descartar
                    </button>
                    <button
                        type="submit"
                        className="peca-form-button salvar"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Salvando...' : saveButtonText}
                    </button>
                </div>
            </div>

            {submitError && (
                <div className="peca-form-error">
                    {submitError}
                </div>
            )}
        </>
    );
}
