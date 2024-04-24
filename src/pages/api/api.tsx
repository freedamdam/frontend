import axios from 'axios'

import { getToken } from 'utils/axiosInstance'

const accessToken = getToken()

// console.log('accesstoken : ', accessToken)

export const API = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API,
	headers: {
		'Content-Type': 'application/json',
		// // Authorization: `Bearer ${accessToken}`,
		// 'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API,
		// 'Access-Control-Allow-Credentials': true,
	},
	// withCredentials: true,
})
