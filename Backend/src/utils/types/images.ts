import FormData from 'form-data';
import axios from 'axios';

export async function uploadImageToImgur(base64: string) {
    const formData = new FormData();
    formData.append('image', base64);
    formData.append('type', 'base64');
    formData.append('title', 'Cooking Recipe Thumbnail');
    formData.append('description', 'This is a thumbnail for a recipe');

    try {
        const response = await axios({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                ...formData.getHeaders()
            },
            data: formData,
            maxBodyLength: Infinity
        });
        const data = await response.data;
        return data.data.link;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}