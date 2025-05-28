
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Controller } from 'react-hook-form';

import FileUpload from '../../components/FileUpload';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';
import ToggleSwitch from '../../components/ToggleSwitch';

import './index.css';


const BackSvg = () => (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.40667 1.06035L-2.92987e-07 7.50035L6.40667 13.9404C6.46453 14.0163 6.53804 14.079 6.62222 14.1241C6.70641 14.1692 6.7993 14.1957 6.89461 14.2018C6.98992 14.2079 7.08542 14.1934 7.17466 14.1593C7.26389 14.1253 7.34477 14.0725 7.41182 14.0045C7.47886 13.9365 7.53052 13.8548 7.56328 13.7651C7.59604 13.6754 7.60914 13.5797 7.6017 13.4845C7.59425 13.3893 7.56644 13.2968 7.52014 13.2133C7.47384 13.1297 7.41013 13.0571 7.33333 13.0004L2.54 8.16702L15.2933 8.16702C15.4701 8.16702 15.6397 8.09678 15.7647 7.97176C15.8898 7.84673 15.96 7.67716 15.96 7.50035C15.96 7.32354 15.8898 7.15397 15.7647 7.02895C15.6397 6.90392 15.4701 6.83369 15.2933 6.83369L2.54 6.83369L7.33333 2.00035C7.45798 1.87482 7.52766 1.7049 7.52704 1.52799C7.52641 1.35109 7.45554 1.18167 7.33 1.05702C7.20446 0.932367 7.03455 0.86269 6.85764 0.863315C6.68073 0.86394 6.51132 0.934817 6.38667 1.06035L6.40667 1.06035Z" fill="#1C1C1C"/>
    </svg>
);

const CloseSvg = () => (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.65486 10.2831C8.78879 10.4171 8.97044 10.4923 9.15984 10.4923C9.34925 10.4923 9.5309 10.4171 9.66483 10.2831C9.79876 10.1492 9.874 9.96755 9.874 9.77815C9.874 9.58874 9.79876 9.40709 9.66483 9.27317L6.12994 5.73828L9.66483 2.2034C9.79876 2.06947 9.874 1.88782 9.874 1.69841C9.874 1.50901 9.79876 1.32736 9.66483 1.19343C9.5309 1.0595 9.34925 0.984259 9.15984 0.984259C8.97044 0.984259 8.78879 1.0595 8.65486 1.19343L5.11998 4.72831L1.58509 1.19343C1.45116 1.0595 1.26951 0.984259 1.08011 0.98426C0.890702 0.984259 0.709054 1.0595 0.575124 1.19343C0.441194 1.32736 0.365953 1.50901 0.365953 1.69841C0.365953 1.88782 0.441194 2.06947 0.575124 2.2034L4.11001 5.73828L0.575124 9.27317C0.441194 9.4071 0.365953 9.58874 0.365953 9.77815C0.365953 9.96755 0.441194 10.1492 0.575124 10.2831C0.709054 10.4171 0.890702 10.4923 1.08011 10.4923C1.26951 10.4923 1.45116 10.4171 1.58509 10.2831L5.11998 6.74825L8.65486 10.2831Z" fill="#D1D1D6"/>
    </svg>
);

export default function PecaFormContent({
    control,
    errors,
    pecaKey,
    selectedFile,
    existingImageUrl,
    onFileSelected,
    onRemoveFile,
    onRemoveExistingImage,
    backToUrl = '/pecas',
}) {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isPreviewingExisting, setIsPreviewingExisting] = useState(false);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    const tiposRecorteOptions = [
        { value: 'frente', label: 'Frente' }, { value: 'aba', label: 'Aba' }, { value: 'lateral', label: 'Lateral' },
    ];
    const modelosOptions = [
        { value: 'trucker', label: 'Boné Trucker' }, { value: 'americano', label: 'Boné Americano' },
    ];
    const posicaoImagemOptions = [
        { value: 'frontal', label: 'Frontal' }, { value: 'traseira', label: 'Traseira' },
    ];
    const tecidosOptions = [ { value: 'linho', label: 'Linho' } ];
    const corTecidoOptions = [
        { value: 'azul-marinho', label: 'Azul marinho' }, { value: 'laranja', label: 'Laranja' },
    ];
    const ordemExibicaoOptions = [
        { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' },
    ];

useEffect(() => {
    //console.log("selectedFile:", selectedFile);
    //console.log("existingImageUrl:", existingImageUrl);

    if (selectedFile) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setImagePreviewUrl(objectUrl);
        setIsPreviewingExisting(false);
        setIsLoadingPreview(false);
        return () => URL.revokeObjectURL(objectUrl);
    } 
    
    else if (existingImageUrl) {
        const bustCacheUrl = existingImageUrl;
        setImagePreviewUrl(bustCacheUrl);
        setIsPreviewingExisting(true);
        setIsLoadingPreview(false);
    } 
    
    else {
        setImagePreviewUrl(null);
        setIsPreviewingExisting(false);
        setIsLoadingPreview(false);
    }
}, [selectedFile, existingImageUrl]);




    const handleRemovePreview = () => {
        if (isPreviewingExisting) {
            onRemoveExistingImage(); 
        } else {
            onRemoveFile();
        }
    };

    return (
        <div className="peca-form-content">
            <div className='peca-form-content-header'>
                <NavLink to={backToUrl} className='peca-form-back'>
                    <BackSvg />
                </NavLink>
                    <Controller
                        name="ativo"
                        control={control}
                        render={({ field }) => (
                            <ToggleSwitch
                            checked={field.value}
                            onChange={field.onChange}
                            />
                        )}
                    />
            </div>

            <div className='peca-form-info'>
                <div className='peca-form-especificacoes'>
                    <h2>Especificações</h2>
                    <ul className='peca-form-list'>

                        <li className='peca-form-list-item'>
                            <Controller name="nomeModelo" control={control} rules={{ required: 'Nome do modelo é obrigatório.' }}
                                render={({ field }) => (
                                    <SelectInput label="Nome do Modelo" value={field.value} onChange={(e) => field.onChange(e.target.value)} options={modelosOptions} placeholder="Escolher" />
                                )} />
                            {errors.nomeModelo && <p className="error-message">{errors.nomeModelo.message}</p>}
                        </li>
                        <li className='peca-form-list-item'>
                            <Controller name="posicaoImagem" control={control} rules={{ required: 'Posição da imagem é obrigatória.' }}
                                render={({ field }) => (
                                    <SelectInput label="Posição da imagem" value={field.value} onChange={(e) => field.onChange(e.target.value)} options={posicaoImagemOptions} placeholder="Escolher" />
                                )} />
                            {errors.posicaoImagem && <p className="error-message">{errors.posicaoImagem.message}</p>}
                        </li>
                        <li className='peca-form-list-item'>
                            <Controller name="tecido" control={control} rules={{ required: 'Tecido é obrigatório.' }}
                                render={({ field }) => (
                                    <SelectInput label="Tecidos" value={field.value} onChange={(e) => field.onChange(e.target.value)} options={tecidosOptions} placeholder="Escolher" />
                                )} />
                            {errors.tecido && <p className="error-message">{errors.tecido.message}</p>}
                        </li>


                        <li className='peca-form-list-item'>
                            <Controller name="tipoRecorte" control={control} rules={{ required: 'Tipo de recorte é obrigatório.' }}
                                render={({ field }) => (
                                    <SelectInput label="Tipo de recorte" value={field.value} onChange={(e) => field.onChange(e.target.value)} options={tiposRecorteOptions} placeholder="Escolher" />
                                )} />
                            {errors.tipoRecorte && <p className="error-message">{errors.tipoRecorte.message}</p>}
                        </li>
                        <li className='peca-form-list-item'>
                            <Controller name="ordemExibicao" control={control} rules={{ required: 'Ordem de exibição é obrigatória.' }}
                                render={({ field }) => (
                                    <SelectInput label="Ordem de exibição" value={field.value} onChange={(e) => field.onChange(e.target.value)} options={ordemExibicaoOptions} placeholder="Ex: 1" />
                                )} />
                            {errors.ordemExibicao && <p className="error-message">{errors.ordemExibicao.message}</p>}
                        </li>
                        <li className='peca-form-list-item'>
                            <Controller name="corTecido" control={control} rules={{ required: 'Cor do tecido é obrigatória.' }}
                                render={({ field }) => (
                                    <SelectInput label="Cor do tecido" value={field.value} onChange={(e) => field.onChange(e.target.value)} options={corTecidoOptions} placeholder="Escolher" />
                                )} />
                            {errors.corTecido && <p className="error-message">{errors.corTecido.message}</p>}
                        </li>
                    </ul>
                </div>
                <div className='peca-form-dados'>
                    <div>
                        <h2>Dados do produto</h2>
                        <Controller name="sku" control={control} rules={{ required: 'Campo sku é obrigatório.' }}
                            render={({ field }) => (
                                <TextInput label="SKU" value={field.value || ''} onChange={(event) => field.onChange(event.target.value)} placeholder="Ex: #123" />
                            )} />
                        {errors.sku && <p className="error-message">{errors.sku.message}</p>}
                    </div>
                    <TextInput label="Chave key gerada" name="key" value={pecaKey} disabled />
                </div>
            </div>

            <div className='peca-form-upload'>
                <h2>Mídia</h2>
                <div className='peca-form-upload-content'>
                    {isLoadingPreview && <p>Carregando preview...</p>}
                    {!isLoadingPreview && imagePreviewUrl && (
                        <div className='peca-form-upload-preview'>
                            <img src={imagePreviewUrl} alt="Preview da Peça" className='peca-form-upload-image' />
                            <button
                                type="button"
                                onClick={handleRemovePreview}
                                className='peca-form-upload-remove'
                                aria-label={isPreviewingExisting ? "Remover imagem existente" : "Remover novo arquivo"}
                            >
                                <CloseSvg />
                            </button>
                        </div>
                    )}
                    <div className='peca-form-upload-input'>
                        <FileUpload
                            onFileSelect={onFileSelected}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}