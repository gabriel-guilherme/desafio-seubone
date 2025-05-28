// src/pages/PecaForm/index.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import './index.css';
import { updateRecorte, uploadRecorteFile, getRecorteById } from '../../services/recortesService';
import PecaFormHeader from '../../components/PecaFormHeader';
import PecaFormContent from '../../components/PecaFormContent';


export default function EditPeca() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [pecaKey, setPecaKey] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);
    const [imageExistingWasRemoved, setImageExistingWasRemoved] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const { control, handleSubmit, formState: { errors, isDirty: formIsDirty }, watch, reset } = useForm({
        defaultValues: {
            nomeModelo: '', tipoRecorte: '', posicaoImagem: '', ordemExibicao: '',
            tecido: '', corTecido: '', ativo: true, sku: '',
        },
        mode: "onChange",
    });

    const { tipoRecorte, posicaoImagem, nomeModelo, tecido, corTecido } = watch();

    useEffect(() => {
        const keyParts = [tipoRecorte || '', posicaoImagem || '', nomeModelo || '', tecido || '', corTecido || ''];
        setPecaKey(keyParts.join('-'));
    }, [tipoRecorte, posicaoImagem, nomeModelo, tecido, corTecido]);

    useEffect(() => {
        const loadPecaData = async (pecaId) => {
            setError(null);
            setExistingImageUrl(null);
            setImageExistingWasRemoved(false);
            setSelectedFile(null);
            try {
                const data = await getRecorteById(pecaId);
                if (data) {
                    reset({
                        nomeModelo: data.tipo_produto || '',
                        tipoRecorte: data.tipo_recorte || '',
                        posicaoImagem: data.posicao_recorte || '',
                        ordemExibicao: data.ordem_exibicao ? String(data.ordem_exibicao) : '',
                        tecido: data.material || '',
                        corTecido: data.cor_material || '',
                        ativo: data.status,
                        sku: data.sku || '',
                    });
                    if (data.url_imagem) { 
                        setExistingImageUrl(data.url_imagem + '.png');
                    }
                } else {
                    setError('Peça não encontrada. Verifique o ID fornecido.');
                }
            } catch (err) {
                console.error('Erro ao carregar peça:', err);
                setError('Não foi possível carregar os dados da peça. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            setLoading(true);
            loadPecaData(id);
        } else {
            console.error("EditPeca: ID da peça não foi fornecido na URL.");
            setError("Um ID de peça é obrigatório para acessar esta página de edição. Por favor, verifique a URL ou retorne à lista de peças.");
            setLoading(false);
        }
    }, [id, reset, navigate]);


    const onSubmit = async (formData) => {
        if (!id) {
            setSubmitError("ID da peça ausente.");
            console.error("Tentativa de submissão sem ID em EditPeca.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const recortePayload = {
                ordem_exibicao: parseInt(formData.ordemExibicao, 10),
                sku: formData.sku,
                tipo_recorte: formData.tipoRecorte,
                posicao_recorte: formData.posicaoImagem,
                tipo_produto: formData.nomeModelo,
                material: formData.tecido,
                cor_material: formData.corTecido,
                status: formData.ativo,
            };

            const fileName = `${formData.nomeModelo}_${formData.tipoRecorte}_${formData.tecido}_${formData.corTecido}`;
            const data = await getRecorteById(id);
            console.log(data, id, "MAAMMMAMAMAMAMMAMAMMAMAMMA22222")
            const oldFileName = `${data.tipo_produto}_${data.tipo_recorte}_${data.material}_${data.cor_material}`;
            await updateRecorte(id, recortePayload);

            if(selectedFile) {
                console.log("ENTROU", fileName, oldFileName)
                await uploadRecorteFile(selectedFile, fileName, oldFileName)
            }
            
            
            alert(`Recorte atualizado com sucesso!`);
            navigate('/pecas');

        } catch (error) {
            console.error('Erro ao submeter o formulário:', error);
            let mensagemErro = JSON.parse(error.message);
            let mensagemFinalErro = mensagemErro.error;

            


                if ((mensagemErro.authenticated === false)) {
                    setTimeout(() => navigate('/login'), 3000);
                }

            setSubmitError(mensagemFinalErro);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileSelected = (file) => {
        setSelectedFile(file);
        setExistingImageUrl(null); 
        setImageExistingWasRemoved(false); 
        setSubmitError(null);
    };

    const handleRemoveNewFile = () => { 
        setSelectedFile(null);
        setSubmitError(null);
    };

    const handleRemoveExistingImage = () => { 
        setExistingImageUrl(null); 
        setImageExistingWasRemoved(true); 
        setSelectedFile(null); 
        setSubmitError(null);
    };
    
    const isAltered = formIsDirty || !!selectedFile || imageExistingWasRemoved;

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Carregando dados da peça...</div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                <h2>Erro na Edição da Peça</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/pecas')}>Voltar para Lista de Peças</button>
            </div>
        );
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="peca-form">
            <PecaFormHeader
                isDirty={isAltered}
                isSubmitting={isSubmitting}
                onDiscard={() => navigate('/pecas')}
                submitError={submitError}
                isEditing={true}
            />
            <PecaFormContent
                control={control}
                errors={errors}
                pecaKey={pecaKey}
                selectedFile={selectedFile}
                existingImageUrl={existingImageUrl}
                onFileSelected={handleFileSelected}
                onRemoveFile={handleRemoveNewFile} 
                onRemoveExistingImage={handleRemoveExistingImage}
                backToUrl='/pecas'
            />
        </form>
    );
}