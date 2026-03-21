(function() {
	function onDomReady(fn) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', fn, { once: true });
			return;
		}

		fn();
	}

	function typeText(elementId, text, speed) {
		const element = document.getElementById(elementId);
		if (!element || element.dataset.typed === 'true') {
			return;
		}

		element.dataset.typed = 'true';

		let index = 0;
		function type() {
			if (index >= text.length) {
				return;
			}

			element.innerHTML += text.charAt(index);
			index += 1;
			window.setTimeout(type, speed);
		}

		type();
	}

	function initOpeningSlide() {
		if (typeof window.title === 'function') {
			const titleSvg = document.getElementById('MD1');
			const updateButton = document.getElementById('updateValues1');
			if (titleSvg && updateButton && !titleSvg.dataset.initialized) {
				titleSvg.dataset.initialized = 'true';
				window.title('MD1', 'updateValues1', 30, 0.75);
			}
		}

		typeText('title-text2', '基于机器学习的多尺度建模计算与控制', 30);
		window.setTimeout(function() {
			typeText('author2', '吕力遥（Liyao Lyu）', 30);
		}, 2000);
		window.setTimeout(function() {
			typeText('department2', 'Department of Mathematics', 30);
		}, 2500);
		window.setTimeout(function() {
			typeText('school2', 'University of California, Los Angeles', 30);
		}, 3000);
	}

	function layoutHeatConductionPlot() {
		if (typeof window.Plotly === 'undefined') {
			return;
		}

		const plotId = '38d86c9b-66ba-4c03-a5a1-33a6b0960fff';
		const graph = document.getElementById(plotId);
		if (!graph || !graph.parentElement) {
			return;
		}

		const size = Math.max(360, Math.min(430, graph.parentElement.clientWidth - 24));

		window.Plotly.relayout(graph, {
			width: size,
			height: size,
			autosize: false,
			'legend.x': 0.62,
			'legend.y': 0.98,
			'legend.font.size': 14,
			'updatemenus[0].x': 0.98,
			'updatemenus[0].y': 0.0,
			'updatemenus[0].xanchor': 'right',
			'updatemenus[0].yanchor': 'bottom',
			'updatemenus[0].font.size': 14,
			'annotations[0].font.size': 14,
			'margin.l': 80,
			'margin.r': 18,
			'margin.t': 36,
			'margin.b': 78,
			'xaxis.title.font.size': 14,
			'xaxis.tickfont.size': 14,
			'yaxis.title.font.size': 14,
			'yaxis.tickfont.size': 14
		}).then(function() {
			window.Plotly.Plots.resize(graph);
		}).catch(function() {});
	}

	function scheduleHeatConductionPlotLayout() {
		layoutHeatConductionPlot();
		window.setTimeout(layoutHeatConductionPlot, 150);
		window.setTimeout(layoutHeatConductionPlot, 600);
	}

	function initEcologyVideoPlayback() {
		document.querySelectorAll('video[data-playback-rate]').forEach(function(video) {
			if (video.dataset.playbackInitialized === 'true') {
				return;
			}

			video.dataset.playbackInitialized = 'true';

			const rate = Number(video.dataset.playbackRate || '1');
			if (!Number.isFinite(rate) || rate <= 0) {
				return;
			}

			function applyPlaybackRate() {
				video.defaultPlaybackRate = rate;
				video.playbackRate = rate;
			}

			if (video.readyState >= 1) {
				applyPlaybackRate();
			}

			video.addEventListener('loadedmetadata', applyPlaybackRate);
			video.addEventListener('play', applyPlaybackRate);
		});
	}

	function initRevealHooks() {
		if (typeof window.Reveal === 'undefined' || window.Reveal.__ustcHelpersBound) {
			return;
		}

		window.Reveal.__ustcHelpersBound = true;

		window.Reveal.on('fragmentshown', function(event) {
			const section = event.fragment && event.fragment.closest('section');
			if (!section || !section.querySelector('#nn-figs')) {
				return;
			}

			if (event.fragment.getAttribute('data-fragment-index') === '3') {
				section.classList.add('focus-left');
			}
		});

		window.Reveal.on('fragmenthidden', function(event) {
			const section = event.fragment && event.fragment.closest('section');
			if (!section || !section.querySelector('#nn-figs')) {
				return;
			}

			if (event.fragment.getAttribute('data-fragment-index') === '3') {
				section.classList.remove('focus-left');
			}
		});

		window.Reveal.on('ready', function() {
			scheduleHeatConductionPlotLayout();
			initEcologyVideoPlayback();
		});

		window.Reveal.on('slidechanged', function() {
			scheduleHeatConductionPlotLayout();
			initEcologyVideoPlayback();
		});
	}

	onDomReady(function() {
		initOpeningSlide();
		scheduleHeatConductionPlotLayout();
		initEcologyVideoPlayback();
		initRevealHooks();
		window.addEventListener('resize', layoutHeatConductionPlot);
	});

	window.addEventListener('load', function() {
		scheduleHeatConductionPlotLayout();
		initEcologyVideoPlayback();
	});
})();
