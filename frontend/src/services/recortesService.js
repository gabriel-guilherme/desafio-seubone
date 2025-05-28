const API_URL = `${process.env.REACT_APP_API_URL}/recortes`;

export const getRecortes = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const resultText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }

        try {
            return JSON.parse(resultText);
        } catch (e) {
            return resultText;
        }

    } catch (error) {
        console.error('Erro na requisição de recortes:', error);
        throw error;
    }
}

export const getRecorteById = async (id) => {
    //console.log(id)
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const resultText = await response.text();
        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }
        try {
            return JSON.parse(resultText);
        } catch (e) {
            return resultText;
        }
    }
    catch (error) {
        console.error('Erro na requisição de recorte por ID:', error);
        throw error;
    }
}

export const getGroupRecortes = async (page = 1, filter = '') => {
    //console.log("ABABA", filter)
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filter && { filter })
    });

    const response = await fetch(`${API_URL}/group?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    if (!response.ok) {
      throw new Error('Erro ao buscar recortes');
    }

    const data = await response.json();
    return data; // { data: [...], pagination: {...} }
  } catch (error) {
    console.error('Erro em getGroupRecortes:', error);
    throw error;
  }
};

export const createRecorte = async (data) => {
    try {
        const bodyPayload = JSON.stringify(data);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyPayload,
            credentials: 'include'
        });

        const resultText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }

        try {
            return JSON.parse(resultText);
        } catch (e) {
            return resultText;
        }

    } catch (error) {
        console.error('Erro na requisição de recortes:', error);
        throw error;
    }
}

export const deleteRecorte = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const resultText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }

        return resultText;

    } catch (error) {
        console.error('Erro na requisição de exclusão de recortes:', error);
        throw error;
    }
}

export const updateRecorte = async (id, data) => {
    try {
        const bodyPayload = JSON.stringify(data);

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyPayload,
            credentials: 'include'
        });

        const resultText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }
        

        try {
            return JSON.parse(resultText);
        } catch (e) {
            return resultText;
        }

    } catch (error) {
        console.error('Erro na requisição de atualização de recortes:', error);
        throw error;
    }
}


export const uploadRecorteFile = async (file, public_id, old_public_id) => {
    try {
        const formData = new FormData();
        formData.append('imagem', file);
        formData.append('nomeNovo', public_id);
        formData.append('nomeAntigo', old_public_id);

        //console.log("Enviando arquivo para substituição:", file);

        const response = await fetch(`${API_URL}/substituir?public_id=${public_id}`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const resultText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }

        return JSON.parse(resultText);
    } catch (error) {
        console.error('Erro na requisição de substituição de imagem:', error);
        throw error;
    }
};

export const deleteRecorteFile = async (public_id) => {
    //console.log(public_id)
    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ public_id }),
            credentials: 'include'
        });

        //console.log(response)

        const resultText = await response.text();

        if (!response.ok) {
            try {
                const errorJson = JSON.parse(resultText);
                throw new Error(errorJson.message || resultText);
            } catch (e) {
                throw new Error(resultText);
            }
        }

        return resultText;

    } catch (error) {
        console.error('Erro na requisição de exclusão de imagem de recorte:', error);
        throw error;
    }
}