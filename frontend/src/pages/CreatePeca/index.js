import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './index.css';
import { createRecorte, uploadRecorteFile } from '../../services/recortesService';
import PecaFormHeader from '../../components/PecaFormHeader';
import PecaFormContent from '../../components/PecaFormContent';


export default function CreatePeca() {
    const navigate = useNavigate();
    const [pecaKey, setPecaKey] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null); 

    const { control, handleSubmit, formState: { errors, isDirty }, watch } = useForm({
        defaultValues: {
            nomeModelo: '',
            tipoRecorte: '',
            posicaoImagem: '',
            ordemExibicao: '',
            tecido: '',
            corTecido: '',
            ativo: 1,
            sku: '',
        },
        mode: "onChange",
    });

    const tipoRecorte = watch('tipoRecorte');
    const posicaoImagem = watch('posicaoImagem');
    const modelo = watch('nomeModelo');
    const material = watch('tecido');
    const corTecido = watch('corTecido');

    useEffect(() => {
        const keyParts = [
            tipoRecorte || '',
            posicaoImagem || '',
            modelo || '',
            material || '',
            corTecido || ''
        ];
        setPecaKey(keyParts.join('-'));
    }, [tipoRecorte, posicaoImagem, modelo, material, corTecido]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const recortePayload = {
                modelo: `${data.tipoRecorte} ${data.posicaoImagem}`,
                ordem_exibicao: parseInt(data.ordemExibicao),
                sku: data.sku,
                tipo_recorte: data.tipoRecorte,
                posicao_recorte: data.posicaoImagem,
                tipo_produto: data.nomeModelo,
                material: data.tecido,
                cor_material: data.corTecido,
                status: data.ativo
            };

            const peca = await createRecorte(recortePayload);

            if (selectedFile) {
                //console.log(peca)
                const fileName = `${data.nomeModelo}_${data.tipoRecorte}_${data.tecido}_${data.corTecido}`;
                await uploadRecorteFile(selectedFile, fileName, '', peca.id);
            }
            
            alert('Formulário submetido com sucesso!');
            navigate('/pecas');

        } catch (error) {
            console.error('Erro ao submeter o formulário:', error);
            if (error.response && error.response.data) {
                if ((error.response.status === 403 || error.response.status === 401) && error.response.data.error === "Token invalido") {
                    setSubmitError('Sua sessão expirou ou o token é inválido. Por favor, faça login novamente.');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setSubmitError(error.response.data.message || 'Ocorreu um erro no servidor. Tente novamente mais tarde.');
                }
            } else if (error.request) {
                setSubmitError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
            } else {
                JSON.parse(error.message);
                setSubmitError('Ocorreu um erro ao processar sua solicitação.' + JSON.parse(error.message).error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileSelected = (file) => {
        setSelectedFile(file);
        setSubmitError(null);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setSubmitError(null);
    }




    return (
        <form onSubmit={handleSubmit(onSubmit)} className="peca-form">
            <PecaFormHeader
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onDiscard={() => navigate('/pecas')}
                submitError={submitError}
            />

            <PecaFormContent
                control={control}
                errors={errors}
                pecaKey={pecaKey}
                selectedFile={selectedFile}
                onFileSelected={handleFileSelected}
                onRemoveFile={handleRemoveFile}
                backToUrl='/pecas'
            />
        </form>
    );
}