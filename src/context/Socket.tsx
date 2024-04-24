import { io } from 'socket.io-client'
import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const url = 'ws://localhost:3000'
const defualtState = {
	socket: null,
	connected: false,
	reconnect: () => {},
}

export const SocketContext = createContext<any>(defualtState)
export const SocketProvider = ({ children }: { children: JSX.Element }) => {
	const [socket, setSocket] = useState<any>(defualtState.socket)
	const [connected, setConnected] = useState<boolean>(defualtState.connected)

	const reconnect = (option: any) => {
		setSocket(
			io(url, {
				secure: true,
				transports: ['websocket'],
				query: option,
				// reconnection: true,
				reconnectionDelay: 1000,
				reconnectionAttempts: 3,
			}),
		)
	}

	useEffect(() => {
		if (!socket) return
		socket.on('connect', () => setConnected(true))
		socket.on('disconnect', () => setConnected(false))
	}, [socket])

	useEffect(() => {
		if (!connected) return console.log('[-] Socket Disconnected')
		else console.log('[#] Socket Connected')

		socket.on('error', (data: any) => toast.error(data.msg))
		socket.on('test', (data: any) => console.log('[*] Socket test', data))
	}, [connected])

	return <SocketContext.Provider value={{ socket, connected, reconnect }}>{children}</SocketContext.Provider>
}
