import axios from 'axios';

const PATH = import.meta.env.VITE_API_URL;

export const fetchProducts = async () => {
    axios({
        method: 'get',
        url: 'url',
        data: {
            data
        }
    })

        .then(response => console.log(response))

        .catch(error => console.log("fetchProducts failed.", error));
}