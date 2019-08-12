import React, { useState } from 'react';
import { Button, IconButton, Paper, Typography, Toolbar } from '@material-ui/core';
import './sounds.scss';

export const Sounds = props => {

	const [playing, setIsPlaying] = useState(null);
	const [showControls, setShowControls] = useState(false);

	const soundList = [
		{
			audio: '/media/sounds/Train Whistle-SoundBible.com-458982136.mp3',
			name: 'Horn 1'
		}
	];

	const handlePlaySound = sound => {
		setIsPlaying(sound);
	}

	return (
		<React.Fragment>
			<h1>Sounds</h1>
			<Paper className="sounds">
				{soundList.map(sound => (
					<Button key={sound.name} onClick={() => handlePlaySound(sound)} variant="contained" color="primary">
						{sound.name}
					</Button>
				))}
				<section className="options">
					<label>
						<input type="checkbox" onClick={() => setShowControls(!showControls)} checked={showControls} /> Show Controls
					</label>
				</section>
				{playing && (
					<section>
						<h3>Now Playing: {playing.name}</h3>
						<audio autoplay controls={showControls}>
							<source src={playing.audio} type="audio/mpeg" />
						</audio>
						<Button onClick={() => handlePlaySound(null)} variant="contained" color="secondary">CLEAR</Button>
					</section>
				)}
			</Paper>
		</React.Fragment>
	)

}

export default Sounds;