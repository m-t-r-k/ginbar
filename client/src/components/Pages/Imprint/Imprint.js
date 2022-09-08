import React from 'react';
import { useEffect } from "react";
import HeadlineTextGradientBg from "../../HeadlineTextGradientBg/HeadlineTextGradientBg";
import MotionWrapper from "../../MotionWrapper";
import './Imprint.scss';
import WebsiteDate from '../../../data/website-data.json';
import parse from 'html-react-parser';

const Imprint = () => {
	
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const imprintGeneral = WebsiteDate.imprint.general;
	const imprintDisclaimer = WebsiteDate.imprint.disclaimer;

  return(
	
    <MotionWrapper>
		<section className='pageWrapper'>
			<HeadlineTextGradientBg image={imprintGeneral.image}>
				<h1>{imprintGeneral.headline}</h1>
				<div className='impressum'>
					<p>
						{parse(imprintGeneral.text)}
					</p>
				</div>
				<br></br>
				<br></br>
				<h2>{imprintDisclaimer.headline}</h2>
				<div className='impressum'>
					<p>{parse(imprintDisclaimer.text)}</p>
					{/*
					<br></br>
					<strong>Google Analytics</strong><br></br>
					<br></br>
					Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. (''Google''). Google Analytics verwendet sog. ''Cookies'', Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer IP-Adresse) wird an einen Server von Google in den USA übertragen und dort gespeichert. Google wird diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen. Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.
					</p>
					<p>
					Website Impressum erstellt durch <a href="https://www.impressum-generator.de">impressum-generator.de</a> von der <a href="https://www.kanzlei-hasselbach.de/" rel="nofollow">Kanzlei Hasselbach</a>
					</p>
					*/}
				</div>
			</HeadlineTextGradientBg>
		</section>
	</MotionWrapper>
  )
}

export default Imprint;
