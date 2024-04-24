import styled from 'styled-components'

export const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;

	margin-bottom: 2rem;

	@media screen and (max-width: 768px) {
		margin-bottom: 1.2rem;
	}
`

export const InputLabel = styled.label`
	margin-left: 0.8rem;
	font-weight: 900;
	font-size: 1.6rem;

	@media screen and (max-width: 768px) {
		font-size: 1.4rem;
	}
`

export const Input = styled.input`
	width: 100%;

	border: none;
	border-radius: 2.8rem;
	padding: 1.6rem 2.4rem;
	background-color: #f4f6f8;
	margin-top: 0.8rem;
	margin-bottom: 0.4rem;
	font-size: 1.3rem;

	@media screen and (max-width: 768px) {
		font-size: 1.2rem;
		padding: 1.2rem 2rem;
	}

	&::placeholder {
		color: #adb2bb;
		font-size: 1.3rem;
	}
`

export const MessageText = styled.p`
	color: #ff3a3a;
	font-size: 1.2rem;
	margin-top: 0.4rem;
	margin-left: 1rem;
`

export const FormRadioLabel = styled.label`
	padding: 14px 36px;

	border: 1px solid #adb2bb;
	border-radius: 50px;

	display: flex;
	justify-content: center;
	align-items: center;

	cursor: pointer;

	@media screen and (max-width: 768px) {
		width: 100%;
		padding: 10px 0px;
		font-size: 14px;
	}
`

export const FormRadioInput = styled.input.attrs({ type: 'radio' })`
	display: none;

	&:checked {
		display: inline-block;
		background: none;
		padding: 0px 10px;
		text-align: center;
		height: 35px;
		line-height: 33px;
		font-weight: 500;
		display: none;
	}
	&:checked + ${FormRadioLabel} {
		border: 2px solid #184da0;
		font-weight: 900;
		color: #184da0;
	}
`

export const Button = styled.button`
	white-space: nowrap;

	font-size: 1.3rem;
	font-weight: 900;
	color: #184da0;

	padding: 1rem 1.6rem;

	border: 1px solid #adb2bb;
	border-radius: 50px;

	&:hover {
		border: 1px solid #184da0;
	}
`
