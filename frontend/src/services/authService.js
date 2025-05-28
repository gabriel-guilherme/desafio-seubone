

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;


export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', 
            body: JSON.stringify({ email, password })
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
        console.error('Erro na requisição de login:', error);
        throw error;
    }
};


export const logoutUser = async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            // body: JSON.stringify({})
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
        console.error('Erro na requisição de logout:', error);
        throw error;
    }
};



// - refreshToken