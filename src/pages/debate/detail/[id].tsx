import type { NextPage, NextPageContext } from 'next'
//-next
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'redux/hook'
import { DebateAction } from 'redux/module/debate'
import { DebateChatAction } from 'redux/module/debateChat'
import { useAuth } from 'utils/hooks/useAuth'
//-modules
import moment from 'moment'
import { toast } from 'react-toastify'
import { LayoutContext } from 'context/Layout'
//-Components
import Layout from 'layout'
import DebateMemberJoinModal from 'components/Debate/modal/MemberJoin'
import DebateMemberCancelModal from 'components/Debate/modal/MemberCancel'
import DebateObserveJoinModal from 'components/Debate/modal/ObserveJoin'
//-assets
import ArrowSVG from 'public/icons/btn_left_arrow_pc.svg'
import ArrowMSVG from 'public/icons/btn_left_arrow_m.svg'

interface Props {
	id: string
}

export const getServerSideProps = async (context: NextPageContext) => {
	const { query } = context
	const { id } = query

	return { props: { id } }
}

const colors = {
	'시작 전': {
		text: '#4DCB96',
	},
	'진행 중': {
		text: '#ED7743',
	},
	종료: {
		text: '#ACB1BA',
	},
	취소: {
		text: '#ACB1BA',
	},
}

const DebateDetailViewPage: NextPage<Props> = ({ id }: Props) => {
	const router = useRouter()
	const dispatch = useAppDispatch()

	const { device } = useContext(LayoutContext)
	const { user } = useAuth()
	const { info, status, errors, msg } = useAppSelector((state) => state.debate)

	const isAuthor = info?.authorId === user?.id
	const isMember = info?.agreeUserIds?.includes(user?.id || '') || info?.disagreeUserIds?.includes(user?.id || '')
	const isObserve = info?.observeUserIds?.includes(user?.id || '')
	const isWait = info?.status === '시작 전'
	const isEnd = info?.status === '종료'
	//-State
	const [modalJoin, setModalJoin] = useState<boolean>(false)
	const [modalCancel, setModalCancel] = useState<boolean>(false)
	const [modalObserve, setModalObserve] = useState<boolean>(false)

	useEffect(() => {
		dispatch(DebateAction.GetDetailOne(id))
		dispatch(DebateChatAction.INIT())

		return () => {
			dispatch(DebateAction.INIT_STATUS())
		}
	}, [])

	useEffect(() => {
		if (status === 'error') {
			toast.error(msg)
			dispatch(DebateAction.INIT_STATUS())
		} else if (status === 'join') {
			setModalJoin(false)
			setModalObserve(false)
			if (info?.observeUserIds.includes(user?.id || '')) router.push(`/debate/room/${info.id}`)
		}
	}, [status])

	const color = info?.status && colors[info?.status]

	return (
		<Layout>
			<div className='container pb-12 mt-12 md:mt-16 scroll-hidden md:w-[840px] p-0'>
				<div className='relative flex flex-col items-center pb-12 border-b border-[#E5E8EC]'>
					<div className='absolute left-0 cursor-pointer top-4' onClick={() => router.back()}>
						{device === 'mobile' ? <ArrowSVG width={24} height={24} /> : <ArrowSVG width={32} height={32} />}
					</div>

					<span className='text-base font-extrabold text-blue'>토론 상세</span>
					<span className='my-2 max-w-[70%] md:max-w-[70%] text-xl md:text-[2rem] leading-[2rem] md:leading-[2.4rem] text-center text-main-900 font-extrabold '>
						{info?.title}
					</span>

					{/** 카테고리 */}
					<div className='flex flex-row flex-wrap items-center gap-2'>
						{info?.categorys?.map((str) => (
							<span key={str} className='text-sm font-normal text-blue'>
								#{str}
							</span>
						))}
					</div>
				</div>

				<div className='relative flex flex-col py-[3.6rem] border-b border-[#E5E8EC]'>
					<div className='relative flex flex-col gap-4'>
						<div className='flex flex-row items-center gap-6'>
							<span className='text-base font-normal text-main-900'>진행 상태</span>
							<span className='text-base font-extrabold' style={{ color: color?.text }}>
								{info?.status}
							</span>
						</div>

						<div className='flex flex-row items-center gap-6'>
							<span className='text-base font-normal text-main-900'>토론 일자</span>
							<span className='text-base font-extrabold text-main-900'>{moment(info?.startAt).format('YYYY-MM-DD')}</span>
						</div>

						<div className='flex flex-row items-center gap-6'>
							<span className='text-base font-normal text-main-900'>토론 시간</span>
							<span className='text-base font-extrabold text-main-900'>{moment(info?.startAt).format('a hh:mm')}</span>
						</div>

						<div className='flex flex-row items-center gap-6'>
							<span className='text-base font-normal text-main-900'>토론 인원</span>
							<span className='text-base font-extrabold text-main-900'>
								{info?.maxUsers}:{info?.maxUsers}
							</span>
						</div>
					</div>
				</div>

				<div className='flex flex-col items-center pt-[3.2rem] pb-[4.8rem]'>
					<span className='text-base font-extrabold md:text-lg text-main-900 mb-7'>현재 팀원</span>
					<table className='debate-people'>
						<tr>
							<th>구분</th>
							<th>찬성팀</th>
							<th>반대팀</th>
						</tr>
						{[...Array(info?.maxUsers || 0).keys()].map((val) => (
							<tr>
								<th>{val + 1}번 토론자</th>
								<td>{info?.agreeUsers[val]?.name || '-'}</td>
								<td>{info?.disagreeUsers[val]?.name || '-'}</td>
							</tr>
						))}
					</table>
				</div>

				<div className='flex flex-row justify-between gap-2 md:gap-4'>
					{isAuthor ? (
						<>
							<button className='py-[1.4rem] btn btn-block' onClick={() => router.push(`/debate/form/${info?.id}`)}>
								수정하기
							</button>
							<button
								className='py-[1.4rem] btn btn-block btn-point'
								onClick={() => (isMember ? router.push(`/debate/room/${info?.id}`) : setModalJoin(true))}
							>
								입장하기
							</button>
						</>
					) : isMember ? (
						<>
							{isWait && (
								<button className='py-[1.4rem] btn btn-block' onClick={() => setModalCancel(true)}>
									참가 취소하기
								</button>
							)}
							<button className=' py-[1.4rem] btn btn-block btn-point' onClick={() => router.push(`/debate/room/${info?.id}`)}>
								입장하기
							</button>
						</>
					) : isObserve ? (
						<>
							<button className='py-[1.4rem] btn btn-block btn-point' onClick={() => router.push(`/debate/room/${info?.id}`)}>
								참관하기
							</button>
						</>
					) : (
						<>
							{!isWait && (
								<button className='py-[1.4rem] btn btn-block' onClick={() => setModalObserve(true)}>
									참관하기
								</button>
							)}
							{isWait && (
								<button className='py-[1.4rem] btn btn-block btn-point' onClick={() => setModalJoin(true)}>
									참가하기
								</button>
							)}
						</>
					)}
				</div>
			</div>

			<DebateMemberJoinModal
				open={modalJoin}
				password={!info?.isAllowIncome || false}
				maxUsers={info?.maxUsers || 1}
				agreeUserIds={info?.agreeUserIds || []}
				disagreeUserIds={info?.disagreeUserIds || []}
				onClose={() => setModalJoin(false)}
				onSubmit={(team, password) => dispatch(DebateAction.JoinMemberDebateOne(id, { team, password }))}
			/>

			<DebateMemberCancelModal
				open={modalCancel}
				onClose={() => setModalCancel(false)}
				onSubmit={() => dispatch(DebateAction.CancelJoinDebateOne(id))}
			/>

			<DebateObserveJoinModal
				open={modalObserve}
				password={!info?.isAllowObserve || false}
				onClose={() => setModalObserve(false)}
				onSubmit={(password) => dispatch(DebateAction.JoinObserveDebateOne(id, { password }))}
			/>
		</Layout>
	)
}

export default DebateDetailViewPage
