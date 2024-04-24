import styled from 'styled-components'

const TitleText = ({ title, className }: { title: string; className?: string }) => {
	return <Title className={className}>{title}</Title>
}

const Title = styled.div`
	font-size: 2.8rem;
	font-weight: 900;
	margin-bottom: 1.6rem;

	@media screen and (max-width: 768px) {
		font-size: 2.4rem;
		margin-bottom: 0.8rem;
	}
`

export default TitleText
