import { useContext } from 'react'
import { LayoutContext } from 'context/Layout'

import Textarea from 'react-textarea-autosize'
import EnterSVG from 'public/icons/icon_enter_pc.svg'
import EnterMSVG from 'public/icons/btn_enter_m.svg'

interface Props {
	value: string
	onChange: (val: string) => void
	onSubmit: () => void
	placeholder: string
	className?: string
}

const ChatInput = ({ value, placeholder, onChange, onSubmit, className }: Props) => {
	const { device } = useContext(LayoutContext)
	const isMobile = device === 'mobile'

	return (
		<div className={`relative bg-white border-2 border-blue rounded-[1.6rem] p-[1.6rem] md:p-8 ${className}`}>
			<Textarea
				value={value}
				onChange={(e) => onChange && onChange(e.currentTarget.value.slice(0, 1000))}
				placeholder={placeholder}
				minRows={2}
				maxRows={5}
				className='w-full mb-8 text-base resize-none input-textarea placeholder:text-sm md:placeholder:text-base'
				// onSubmit={() => onSubmit && onSubmit()}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault()
						onSubmit && onSubmit()
					}
				}}
			/>
			<div className='absolute flex flex-row items-center justify-end gap-4 right-3 bottom-2 md:right-4 md:bottom-3'>
				<span className='text-sm font-normal md:text-base text-main-900'>{value.length}/1000</span>
				{!isMobile ? (
					<button className='flex flex-row items-center gap-4 text-sm border-none btn btn-point' onClick={() => onSubmit && onSubmit()}>
						<EnterSVG width={18} height={18} />
						보내기
					</button>
				) : (
					<EnterMSVG />
				)}
			</div>
		</div>
	)
}

export default ChatInput
