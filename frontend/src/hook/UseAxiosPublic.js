import axios from 'axios';

const UseAxiosPublic = () => {
    const axiosPublic =axios.create({
        baseURL:'https://topfitness-t2f1.vercel.app/api'
    })
    return axiosPublic;
};

export default UseAxiosPublic;