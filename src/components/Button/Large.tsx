import styled from 'styled-components'

export const ButtonStyle = styled.button<{ width: string }>`
	padding: 13px 0;
	width: ${(props) => props.width}px;

	color: white;
	font-weight: 800;
	line-height: 30px;
	text-align: center;

	background: linear-gradient(180deg, #515f8d 0%, #3b4b7e 100%);
	border-radius: 30px;

	&:hover {
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	&:active {
		background: linear-gradient(180deg, #324478 0%, #152750 100%);
		box-shadow: none;
	}
`
const LargeButton = ({ text, width }: { text: string; width?: string }) => {
	return <ButtonStyle width={width || '464'}>{text}</ButtonStyle>
}

export default LargeButton
