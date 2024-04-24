import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import Layout from 'layout'
import * as S from './style'

import LargeButton from 'components/Button/Large'
import TitleText from 'components/common/TitleText'
import { API } from 'pages/api/api'

const Register = () => {
	const [identity, setIdentity] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPwd, setConfirmPwd] = useState('')
	const [name, setName] = useState('')
	const [birth, setBirth] = useState('')
	const [sex, setSex] = useState('woman')

	const [idCheckMsg, setIdCheckMsg] = useState('') /** 아이디 유효성 검사를 위한 메세지 */
	const [idCheck, setIdCheck] = useState(false) /** 아이디 중복 확인 상태 */
	const [pwdCheckMsg, setPwdCheckMsg] = useState('') /** 비밀번호 유효성 검사를 위한 메세지 */
	const [pwdConfirmMsg, setPwdConfirmMsg] = useState('') /** 비밀번호 확인을 위한 메세지 */
	const [nameCheckMsg, setNameCheckMsg] = useState('')
	const [dateOfBirthCheckMsg, setDateOfBirthCheckMsg] = useState('') /** 생년월일 유효성 검사를 위한 메세지 */

	const router = useRouter()

	const idRegex = /^(?=.*[a-z])(?=.*[0-9]).{5,20}$/
	const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdCheck(false)
		const userInput = e.target.value
		setIdentity(userInput)

		/** 아이디 유효성 검사 */
		if (userInput.length !== 0 && !idRegex.test(userInput)) return setIdCheckMsg('* 5~20자의 영문 소문자, 숫자를 조합하여 입력해 주세요.')
		return setIdCheckMsg('')
	}

	const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/
	const onChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userInput = e.target.value
		setPassword(userInput)

		/** 비밀번호 유효성 검사 */
		if (userInput.length !== 0 && !passwordRegex.test(userInput))
			return setPwdCheckMsg('* 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력해 주세요.')
		return setPwdCheckMsg('')
	}

	/** 비밀번호 확인 */
	const onChangePwdConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userInput = e.target.value
		setConfirmPwd(userInput)

		if (userInput.length !== 0) {
			if (password.length < 8) return setPwdConfirmMsg('* 비밀번호를 먼저 입력해 주세요.')
			if (userInput.length !== 0 && password !== userInput) return setPwdConfirmMsg('* 비밀번호가 다릅니다.')
		}
		return setPwdConfirmMsg('')
	}

	const nameRegex = /^[가-힣]{2,5}$/
	const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userInput = e.target.value
		setName(userInput)

		/** 이름 유효성 검사*/
		if (userInput.length !== 0 && !nameRegex.test(userInput)) return setNameCheckMsg('* 올바른 이름 형식으로 입력해 주세요.')
		return setNameCheckMsg('')
	}

	const dateOfBirthRegex = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/
	const onChangeDateOfBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userInput = e.target.value
		setBirth(userInput)

		/** 생년월일 유효성 검사 */
		if (userInput.length !== 0 && !dateOfBirthRegex.test(userInput)) return setDateOfBirthCheckMsg('* 숫자 8자리를 입력해주세요.')
		return setDateOfBirthCheckMsg('')
	}

	/** 아이디 중복 확인 */
	const handleDuplicateCheckId = () => {
		if (identity.length === 0) return setIdCheckMsg('* 아이디를 입력해주세요.')

		API.post('/auth/check-identity', JSON.stringify({ identity: identity }))
			.then((response) => {
				console.log(response)
				if (response.status === 200) {
					if (response.data.msg === 'OK') {
						toast('사용 가능한 아이디입니다.')
						setIdCheck(true)
					} else {
						toast.error('이미 사용중인 아이디입니다.')
						setIdCheck(false)
					}
				}
			})
			.catch((error) => {
				console.error('API 요청 중 오류 발생:', error)
			})
	}

	const handleRegister = () => {
		if (!idCheck) return toast.error('아이디 중복 확인을 해주세요.')
		const userData = {
			identity: identity,
			password: password,
			name: name,
			sex: sex,
			birth: birth,
		}

		API.post('/auth/register', JSON.stringify(userData))
			.then((response) => {
				console.log(response)
				if (response.status === 200) {
					toast('회원가입 성공')

					router.push('/login')
				} else {
					toast('회원가입 실패')
				}
			})
			.catch((error) => {
				console.error('API 요청 중 오류 발생:', error)
			})
	}

	return (
		<Layout>
			<div className='flex flex-col items-center justify-center mt-[24px] md:mt-[40px] '>
				<div className='w-[320px] md:w-[640px] flex flex-col justify-center items-center'>
					<TitleText title={'회원가입'} />
					<div className='w-full'>
						<div>
							<S.InputWrapper>
								<S.InputLabel>아이디</S.InputLabel>
								<div className='flex items-center justify-center gap-2'>
									<div className='flex flex-col w-full'>
										<S.Input
											required
											type='text'
											placeholder='아이디'
											value={identity}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeId(e)}
											minLength={5}
											maxLength={20}
										/>
										<S.MessageText>{idCheckMsg}</S.MessageText>
									</div>
									<S.Button onClick={handleDuplicateCheckId}>중복 확인</S.Button>
								</div>
							</S.InputWrapper>
							<S.InputWrapper>
								<S.InputLabel>비밀번호</S.InputLabel>
								<S.Input
									required
									type='password'
									placeholder='비밀번호'
									value={password}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePwd(e)}
									minLength={8}
									maxLength={16}
								/>
								<S.MessageText>{pwdCheckMsg}</S.MessageText>
							</S.InputWrapper>
							<S.InputWrapper>
								<S.InputLabel>비밀번호 확인</S.InputLabel>
								<S.Input
									type='password'
									placeholder='비밀번호 확인'
									required
									value={confirmPwd}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePwdConfirm(e)}
									minLength={8}
									maxLength={16}
								/>
								<S.MessageText>{pwdConfirmMsg}</S.MessageText>
							</S.InputWrapper>
							<S.InputWrapper>
								<S.InputLabel>이름</S.InputLabel>
								<S.Input
									required
									type='text'
									placeholder='이름'
									value={name}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeName(e)}
									minLength={2}
									maxLength={5}
								/>
								<S.MessageText>{nameCheckMsg}</S.MessageText>
							</S.InputWrapper>
							<S.InputWrapper>
								<S.InputLabel>생년월일 8자리</S.InputLabel>
								<S.Input
									required
									type='text'
									placeholder='생년월일 8자리'
									value={birth}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDateOfBirth(e)}
									minLength={8}
									maxLength={8}
								/>
								<S.MessageText>{dateOfBirthCheckMsg}</S.MessageText>
							</S.InputWrapper>
							<div className='pb-[24px] md:pb-[36px] border-b-[1px] border-b-[#D8D8D8] flex flex-col gap-2'>
								<S.InputLabel htmlFor='gender'>성별</S.InputLabel>
								<div className='flex gap-3'>
									<S.FormRadioInput onChange={() => setSex('woman')} type='radio' id='radio-1' name='gender' value='woman' checked />
									<S.FormRadioLabel htmlFor='radio-1'>여자</S.FormRadioLabel>

									<S.FormRadioInput onChange={() => setSex('man')} type='radio' id='radio-2' name='gender' value='man' />
									<S.FormRadioLabel htmlFor='radio-2'>남자</S.FormRadioLabel>
								</div>
							</div>
						</div>
						{/* <div className='mt-[28px] md:mt-[36px]'>
							<p className='font-extrabold md:text-[16px] text-[14px]'>건강한 토의토론 문자를 위해 본인인증 서비스를 실시하고 있습니다.</p>
						</div> */}
						<div className='w-full mt-[2.4rem] md:mt-[3.6rem] md:mb-[4rem] text-[#666666]'>
							<LargeButton text={'완료'} onClick={handleRegister} />
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Register
