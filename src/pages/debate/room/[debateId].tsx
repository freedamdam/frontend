import type { NextPage, NextPageContext } from 'next'
//-next
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { DebateAction } from 'redux/module/debate'
import { DebateChatAction } from 'redux/module/debateChat'
import { useAuth } from 'utils/hooks/useAuth'
import { getToken } from 'utils/axiosInstance'
//-modules
import moment from 'moment'
import { toast } from 'react-toastify'
import { LayoutContext } from 'context/Layout'
import { SocketContext } from 'context/Socket'
//-Components
import Layout from 'layout'
import DebateChatBox from 'components/Chat/ListBox'
import ChatInput from 'components/Chat/Input'
//-assets
import ArrowSVG from 'public/icons/btn_left_arrow_pc.svg'
import ClockSVG from 'public/icons/btn_clock_orange_m.svg'
import PlaySVG from 'public/icons/orange_play_pc.svg'
import DebateStartConfirmModal from 'components/Debate/modal/StartConfirm'

interface Props {
	debateId: string
}

export const getServerSideProps = async (context: NextPageContext) => {
	const { query } = context
	const { debateId } = query

	return { props: { debateId } }
}

const DebateChatRoomPage: NextPage<Props> = ({ debateId }: Props) => {
	const router = useRouter()
	const dispatch = useAppDispatch()

	const { device } = useContext(LayoutContext)
	const { user } = useAuth()
	const { socket, connected, reconnect } = useContext(SocketContext)
	const { info } = useAppSelector((state) => state.debate)
	const { room, chat, status, errors, msg } = useAppSelector((state: { debateChat: DebateState }) => state.debateChat)

	const isAuthor = info?.authorId === user?.id
	const isMember = info?.agreeUserIds?.includes(user?.id || '') || info?.disagreeUserIds?.includes(user?.id || '')
	const isObserve = info?.observeUserIds?.includes(user?.id || '')

	const [count, setCount] = useState<number>(0)
	const [group, setGroup] = useState<string>('all')
	const [message, setMessage] = useState<string>('')

	const [modalConfirm, setModalConfirm] = useState<boolean>(false)

	//-logic
	const { status: step, current } = room || {}
	const { talker, allowTeamChat, startAt, duration } = current || {}

	const chkAllChat = isMember && (talker === user?.id || step === '시작 전')
	const chkTeamChat = isMember && (allowTeamChat || step === '시작 전')
	const chkVisibleInput = (chkAllChat && group === 'all') || (chkTeamChat && group === 'team')

	// 채팅방 정보 가져오기
	useEffect(() => {
		dispatch(DebateAction.GetDetailOne(debateId))
		dispatch(DebateChatAction.GetRoomOne(debateId))

		return () => {
			dispatch(DebateChatAction.INIT())
		}
	}, [])

	//-socket
	useEffect(() => {
		socket?.on('recv_message', (data: any) => recv(data?.data))
		socket?.on('room_update', (data: any) => {
			if (debateId === data?.data?.debateId) dispatch(DebateChatAction.UpdateRoomInfo(data))
		})
		socket?.on('send_finish', (data: any) => {
			setMessage('')
			recv(data?.data)
		})

		return () => {
			socket?.off('recv_message')
			socket?.off('room_update')
			socket?.off('send_finish')
		}
	}, [socket, connected, group])

	useEffect(() => {
		reconnect({ token: getToken() })
	}, [connected, user])

	//-message
	const send = () => {
		if (!message.length) return

		const body = { roomId: room?.id, debateId, message, group }
		socket.emit('send_message', body)
	}
	const recv = (data: any) => {
		const viewAll = group === 'all' && data.group === 'all'
		const viewTeam = group === 'team' && data.group.includes('team')
		if ((viewAll || viewTeam) && (room?.id === data.roomId || room?.id === data.roomId?.id || debateId === data.debateId))
			dispatch(DebateChatAction.AddChatOne(data))
	}

	const start = () => {
		if (!info) return toast.error('채팅방 정보가 없습니다')
		if (!isAuthor) return toast.error('회의 주최자만 시작할 수 있습니다')
		else if (moment(info?.startAt) > moment()) return toast.error('시작 시간 이후에만 시작할 수 있습니다')
		else if (info?.agreeUserIds?.length < info?.maxUsers || info?.disagreeUserIds?.length < info?.maxUsers) return setModalConfirm(true)

		socket.emit('start', { roomId: room?.id, debateId })
	}

	useEffect(() => {
		if (room?.id) dispatch(DebateChatAction.GetChatList(room?.id || '', { group }))
	}, [group, room?.id])

	useEffect(() => {
		if (room?.current?.duration) {
			const past_seconds = moment.duration(moment(moment()).diff(room.current.startAt)).asSeconds()
			setCount(room.current.duration - Math.ceil(past_seconds))
		}
	}, [room?.current])

	useEffect(() => {
		const interval = setInterval(() => {
			if (count > 0) setCount((prevCount) => prevCount - 1)

			clearInterval(interval)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [count])

	return (
		<Layout
			option={{
				style: {
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					overflow: 'hidden',
				},
			}}
		>
			<div className={`${device !== 'mobile' ? 'w-[50vw]' : 'w-[100vw]'} h-[100%] flex flex-col`}>
				<div className='container mx-auto my-[1.4rem] md:my-[2.4rem]'>
					<div className='relative flex flex-col items-center'>
						<div className='absolute left-0 cursor-pointer top-2' onClick={() => router.back()}>
							{device === 'mobile' ? <ArrowSVG width={20} height={20} /> : <ArrowSVG width={28} height={28} />}
						</div>

						<div className='flex flex-col items-center justify-center w-full gap-3'>
							<span className='max-w-[80%] md:max-w-[60%] text-lg md:text-[2rem] leading-[2rem] md:leading-[2.4rem] text-center text-main-900 font-extrabold'>
								{info?.title}
							</span>

							{/* <span className='text-sm md:text-[13px] font-normal'>참관자 : {info?.observeUserIds?.length || 0}명</span> */}
						</div>
					</div>
				</div>

				<div className='relative flex flex-col overflow-hidden md:container grow' style={{ maxHeight: '100vh' }}>
					<div className='flex justify-center items-center w-full bg-[#F4F6F8] pb-4 pt-2'>
						<div className='relative flex top-4 w-[180px] h-[36px] bg-[#E2E8FA] rounded-full '>
							{isMember ? (
								<div className='flex rounded-full '>
									<button
										className={`absolute top-0 left-0 border-none whitespace-nowrap py-3 w-[50%] text-[#747983] font-extrabold ${
											group === 'all' && 'bg-white text-blue '
										} ${group === 'all' ? '' : 'btn-gray'} rounded-[24px]`}
										onClick={() => setGroup('all')}
									>
										전체 채팅
									</button>
									<button
										className={`absolute top-0 right-0 whitespace-nowrap py-3 w-[50%] text-[#747983] font-extrabold border-none ${
											group === 'team' && 'bg-white text-blue'
										} ${group === 'team' ? '' : 'btn-gray'}  rounded-[24px]`}
										onClick={() => setGroup('team')}
									>
										팀 채팅
									</button>
								</div>
							) : undefined}
						</div>
					</div>
					<div className='flex flex-col justify-between mb-0 overflow-auto grow scroll-hidden'>
						<DebateChatBox
							room={room}
							chat={chat || []}
							input={chkVisibleInput}
							className={`${device !== 'mobile' && !isMember && 'rounded-t-[24px]'} h-[100vh] grow px-16 py-8`}
						/>

						<div className='flex flex-col items-center bg-[#F4F6F8] rounded-b-[24px] px-8 pb-8 pt-4'>
							{isAuthor && step === '시작 전' && (
								<div
									className='w-fit flex flex-row gap-[6px] items-center px-6 py-2 mb-6 bg-white border-2 border-orange rounded-full select-none cursor-pointer'
									onClick={() => start()}
								>
									<PlaySVG width={16} height={16} />
									<span className='text-[13px] text-orange font-extrabold'>시작하기</span>
								</div>
							)}

							{count > 0 ? (
								<div
									className={`w-fit flex flex-row gap-[6px] items-center px-6 py-1 ${
										chkVisibleInput && 'mb-6'
									} bg-white border-2 border-orange rounded-full select-none`}
								>
									<ClockSVG width={16} height={16} />
									<span className='text-[13px] text-orange font-extrabold'>{count}초</span>
								</div>
							) : undefined}

							{chkVisibleInput && (
								<ChatInput
									value={message}
									onChange={(val) => setMessage(val)}
									onSubmit={() => send()}
									placeholder='입력하기'
									className='w-full'
								/>
							)}
						</div>
					</div>
				</div>

				<DebateStartConfirmModal
					open={modalConfirm}
					onClose={() => setModalConfirm(false)}
					onSubmit={() => socket.emit('start', { roomId: room?.id, debateId })}
				/>
			</div>
		</Layout>
	)
}

export default DebateChatRoomPage
