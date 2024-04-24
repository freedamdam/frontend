import { useRouter } from 'next/router'
import { useContext } from 'react'
import Modal from 'react-modal'
import { LayoutContext } from 'context/Layout'

import DambiSVG from 'public/icons/dambi/round_color_dambi.svg'
import LockSVG from 'public/icons/orange_lock_pc.svg'

import LargeButton from 'components/Button/Large'

interface Props {
	open: boolean
	onClose: () => void
}

const LoginModal = ({ open, onClose }: Props) => {
	const { device } = useContext(LayoutContext)

	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			padding: 0,
			border: 0,
			radius: 12,
			width: '100%',
			minWidth: device === 'desktop' ? 480 : 320,
			maxWidth: device === 'desktop' ? 480 : 320,
			height: 'auto',
			maxHeight: '100vh',
			overflow: 'auto',
			background: 'none',
		},
		overlay: {
			backgroundColor: 'rgba(0,0,0,0.5)',
		},
	}

	const router = useRouter()

	return (
		<Modal isOpen={open} ariaHideApp={false} style={customStyles} onRequestClose={() => onClose && onClose()} closeTimeoutMS={300}>
			<div className='flex flex-col items-center justify-center p-10 bg-white rounded-3xl'>
				<div className='flex flex-col items-center'>
					<div className='relative mb-5'>
						<DambiSVG width={device == 'mobile' ? 80 : 100} />
						<div className='absolute -right-2 -bottom-1'>
							<LockSVG width={device == 'mobile' ? 30 : 40} />
						</div>
					</div>
					<span className='mb-8 text-base font-extrabold md:text-lg text-main-900'>로그인이 필요한 서비스입니다.</span>
				</div>
				<LargeButton text={'로그인하기'} onClick={() => router.push('/login')} />
				<div className='flex gap-2 mt-6'>
					<span className='text-sm md:text-base text-[#666666]'>아직 회원이 아니신가요?</span>
					<button onClick={() => router.push('/signup')} className='text-sm font-extrabold text-blue md:text-base'>
						회원가입
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default LoginModal
