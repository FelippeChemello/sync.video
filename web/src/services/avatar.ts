import axios from 'axios';

export default async function getAvatar(name: string) {
    const avatarResponse = await axios.get(
        `${
            process.env.NEXT_PUBLIC_AVATAR_PROVIDER_API_URL
        }/?background=random&name=${name.replace(' ', '+')}`,
        {
            responseType: 'blob',
        },
    );

    return avatarResponse.data;
}
