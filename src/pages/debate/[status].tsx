import type { NextPage, NextPageContext } from 'next'
//-next
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { DebateAction } from '../../redux/module/debate'
import { useAuth } from 'utils/hooks/useAuth'

//-Components
import Link from 'next/link'
import Layout from 'layout'
import MenuTab from 'components/Menu/Tab'
import TextInput from 'components/Input/TextInput'
import CheckBox from 'components/Input/CheckBox'
import DebateItemCard from 'components/Debate/Card'
//-assets
import ArrowSVG from 'public/icons/btn_arrow_right.svg'
import SearchSVG from 'public/icons/btn_search.svg'
import DambiSVG from 'public/icons/dambi/round_gray_dambi.svg'
//-types
import { DebateCategory } from 'types/debate/info'
import { LayoutContext } from 'context/Layout'

import LoginModal from 'components/common/LoginModal'

interface Props {
	status: string
}

// Server의 SSR 렌더링을 위한 함수, 이 함수를 사용하면 페이지가 요청될 때마다 서버 측에서 데이터를 가져와 페이지의 초기 props를 설정할 수 있음
export const getServerSideProps = async (context: NextPageContext) => {
	const { query } = context
	const { status } = query

	return { props: { status } }
}

const menu_list = [
	{ label: '전체', value: '전체' },
	{ label: '시작 전', value: '시작 전' },
	{ label: '진행 중', value: '진행 중' },
	{ label: '종료', value: '종료' },
]

const DebateSearchPage: NextPage<Props> = ({ status }: Props) => {
	const router = useRouter()
	const dispatch = useAppDispatch()

	const { device } = useContext(LayoutContext)
	const { user } = useAuth()
	const loggedIn = user?.id

	const { dashboard, data, page, count, totalPages } = useAppSelector((state) => state.debate)
	//-chk
	const isAll = status === '전체'

	//-search
	const [category, setCategory] = useState<string>('')
	const [maxUsers, setMaxUsers] = useState<string>('')
	const [search, setSearch] = useState<string>('')
	const [my, setMy] = useState<boolean>(false)

	const [modal, setModal] = useState<boolean>(false)

	const goAddPage = () => {
		if (!loggedIn) return setModal(true)
		router.push('/debate/form/new')
	}

	const goDebateDetailPage = (id: string) => {
		if (!loggedIn) return setModal(true)
		router.push(`/debate/detail/${id}`)
	}

	const body = { status, category, search, my, maxUsers }
	const loadMore = () => dispatch(DebateAction.Search({ ...body, page: page + 1, perPage: 12 }))
	const explore = ({ reset, more }: { reset?: boolean; more?: boolean }) => {
		if (isAll) return dispatch(DebateAction.GetDashboard(body))
		else if (reset) dispatch(DebateAction.Search({ ...body, page: 0, perPage: 12 }))
		else if (more && page + 1 < totalPages) loadMore()
		dispatch(DebateAction.Search({ ...body, page: 0, perPage: 12 }))
	}

	//-useEffect
	useEffect(() => {
		explore({ reset: true })
	}, [status])
	useEffect(() => {
		explore({})
	}, [category, my, maxUsers])

	//-Components
	const NoResult = () => (
		<div className='flex flex-col items-center w-full gap-6 mt-8 mb-20'>
			<DambiSVG width={100} height={100} />
			<span className='text-base font-normal text-center text-main-900'>
				토론이 없습니다.
				<br />
				지금 바로 토론을 개설해보세요.
			</span>
		</div>
	)

	const Dashboard = () => {
		const isEmpty =
			Object.values(dashboard || {})
				.map((obj) => obj.length)
				.reduce((a, b) => a + b, 0) === 0

		const wait = (dashboard || {})['시작 전']
		const ing = (dashboard || {})['진행 중']
		const end = (dashboard || {})['종료']

		return (
			<div className='flex flex-col gap-16 mb-20'>
				{isEmpty && <NoResult />}

				{wait?.length ? (
					<div className='flex flex-col gap-5'>
						<div className='flex flex-row items-center justify-between'>
							<span className='text-lg font-extrabold md:text-xl text-main-900'>토론자 모집 중</span>
							<Link href={`/debate/${menu_list[1].value}`}>
								<div className='flex flex-row items-center gap-[2px]'>
									<span className='text-[13px] leading-4 text-main-900 font-normal'>더보기</span>
									<ArrowSVG width={16} height={16} />
								</div>
							</Link>
						</div>

						<div className='flex flex-row flex-wrap gap-10'>
							{wait?.map((obj) => (
								<DebateItemCard key={obj.id} column={device !== 'desktop' ? 1 : 3} data={obj} onClick={() => goDebateDetailPage(obj.id)} />
							))}
						</div>
					</div>
				) : undefined}

				{ing?.length ? (
					<div className='flex flex-col gap-5'>
						<div className='flex flex-row items-center justify-between'>
							<span className='text-lg font-extrabold md:text-xl text-main-900'>실시간 토론 중</span>
							<Link href={`/debate/${menu_list[2].value}`}>
								<div className='flex flex-row items-center gap-[2px]'>
									<span className='text-[13px] leading-4 text-main-900 font-normal'>더보기</span>
									<ArrowSVG width={16} height={16} />
								</div>
							</Link>
						</div>

						<div className='flex flex-row flex-wrap gap-10'>
							{ing?.map((obj) => (
								<DebateItemCard key={obj.id} column={device !== 'desktop' ? 1 : 3} data={obj} onClick={() => goDebateDetailPage(obj.id)} />
							))}
						</div>
					</div>
				) : undefined}

				{end?.length ? (
					<div className='flex flex-col gap-5'>
						<div className='flex flex-row items-center justify-between'>
							<span className='text-lg font-extrabold md:text-xl text-main-900'>토론자 모집 완료</span>
							<Link href={`/debate/${menu_list[3].value}`}>
								<div className='flex flex-row items-center gap-[2px]'>
									<span className='text-[13px] leading-4 text-main-900 font-normal'>더보기</span>
									<ArrowSVG width={16} height={16} />
								</div>
							</Link>
						</div>

						<div className='flex flex-row flex-wrap gap-10'>
							{end?.map((obj) => (
								<DebateItemCard key={obj.id} column={device !== 'desktop' ? 1 : 3} data={obj} onClick={() => goDebateDetailPage(obj.id)} />
							))}
						</div>
					</div>
				) : undefined}
			</div>
		)
	}

	const Search = () => (
		<div className='flex flex-col'>
			<div className='flex flex-row flex-wrap gap-10'>
				{!data?.length ? (
					<NoResult />
				) : (
					<>
						{data?.map((obj) => (
							<DebateItemCard key={obj.id} column={device !== 'desktop' ? 1 : 3} data={obj} onClick={() => goDebateDetailPage(obj.id)} />
						))}
					</>
				)}
			</div>
		</div>
	)

	return (
		<Layout>
			<div className='container p-0 mx-auto mt-12 md:mt-13 md:mb-13 mb:12'>
				<div className='flex flex-col items-center mb-16'>
					<span className='mb-2 text-[2rem] font-extrabold md:text-[3.2rem] text-main-900'>토론</span>
					<span className='text-sm font-normal md:text-lg text-main-900'>사람들과 다양한 주제로 토론해보세요.</span>
				</div>

				<div className='flex flex-col'>
					<MenuTab active={status} onClick={(val) => router.push(`/debate/${val}`)} list={menu_list} className='pb-4 mb-8' />

					<div className='flex flex-col flex-wrap justify-between gap-3 mb-12 md:flex-row'>
						<div className='flex items-center gap-3 grow'>
							<TextInput
								type='select'
								placeholder='전체'
								value={category}
								onChange={(val: string) => setCategory(val)}
								options={[{ label: '전체', value: undefined }, ...DebateCategory.map((str) => ({ label: str, value: str }))]}
								boxClass='w-full md:min-w-[160px] md:max-w-[160px]'
							/>
							<TextInput
								type='select'
								placeholder='전체'
								value={maxUsers}
								onChange={(val: string) => setMaxUsers(val)}
								options={[
									{ label: '전체', value: '' },
									{ label: '1:1', value: '1:1' },
									{ label: '2:2', value: '2:2' },
									{ label: '3:3', value: '3:3' },
									{ label: '4:4', value: '4:4' },
								]}
								boxClass='w-full md:min-w-[160px] md:max-w-[160px]'
							/>

							{loggedIn && <CheckBox text='내 토론만 보기' check={my} setCheck={(val) => setMy(val)} />}
						</div>
						<div className='flex flex-col items-center justify-end gap-3 grow md:flex-row'>
							<TextInput
								type='text'
								placeholder='검색어를 검색하세요.'
								value={search}
								onChange={(val: string) => setSearch(val)}
								onSubmit={() => explore({})}
								rightIcon={<SearchSVG width={24} height={24} onClick={() => explore({})} className='cursor-pointer' />}
								boxClass='w-full md:w-[320px]'
							/>

							<button className='w-full btn md:w-fit py-[1.3rem]' onClick={goAddPage}>
								토론 개설하기
							</button>
						</div>
					</div>

					{isAll ? <Dashboard /> : <Search />}
				</div>
			</div>
			<LoginModal open={modal} onClose={() => setModal(false)} />
		</Layout>
	)
}

export default DebateSearchPage
