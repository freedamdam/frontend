import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from 'layout'
import * as S from './style'

import TitleText from 'components/common/TitleText'
import LargeButton from 'components/Button/Large'

import styled from 'styled-components'
import { useAuth } from 'utils/hooks/useAuth'
import { toast } from 'react-toastify'

const Login = () => {
	const router = useRouter()

	const [identity, setIdentity] = useState('')
	const [password, setPassword] = useState('')

	const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdentity(e.target.value)
	}

	const onChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const { handleLogin } = useAuth()

	const onSubmit = async () => {
		const userData = {
			identity: identity,
			password: password,
		}

		handleLogin(userData)
	}

	return (
		<Layout>
			<div className='container flex flex-col items-center mx-auto mt-[88px] text-center p-0 md:w-[464px] h-full'>
				<TitleText title='로그인' />
				<div className='w-full'>
					<div className='mt-[48px] flex flex-col gap-4'>
						<Input
							required
							placeholder='아이디 입력'
							value={identity}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeId(e)}
							maxLength={20}
						/>

						<Input
							required
							type='password'
							placeholder='비밀번호 입력'
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePwd(e)}
							minLength={8}
							maxLength={16}
						/>
					</div>
					<div className='w-full mt-8'>
						<LargeButton text={'로그인하기'} onClick={onSubmit} />
					</div>
				</div>

				<div className='flex gap-2 mt-4'>
					<span className='text-[1.3rem] md:text-base text-[#666666]'>아직 회원이 아니신가요?</span>
					<button onClick={() => router.push('/signup')} className='text-blue text-[1.3rem] md:text-base font-extrabold'>
						회원가입
					</button>
				</div>

				<div className='flex w-full gap-4 mt-16'>
					<S.FindButton onClick={() => toast.error('준비 중입니다...')}>아이디 찾기</S.FindButton>
					<S.FindButton onClick={() => toast.error('준비 중입니다...')}>비밀번호 찾기</S.FindButton>
				</div>
			</div>
		</Layout>
	)
}

export default Login

const Input = styled.input`
	border: none;
	border-radius: 2.8rem;
	background-color: #f4f6f8;
	padding: 1.8rem 2.4rem;
	font-size: 1.2rem;

	&::placeholder {
		color: #adb2bb;
	}

	@media screen and (max-width: 768px) {
		font-size: 1.2rem;
		padding: 1.2rem 2rem;
	}
`
