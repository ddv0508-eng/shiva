const tracks = [
  {
    title: "Jaikal Mahakal",
    url: "https://files.catbox.moe/vgyux4.mp3"
  },
  {
    title: "Karpur Gauram Karunavtaram",
    url: "https://files.catbox.moe/tlxuyv.mp3"
  },
  {
    title: "Lingaashtakam",
    url: "https://files.catbox.moe/cgn808.mp3"
  },
  {
    title: "Mera Bhola Hai Bhandari",
    url: "https://files.catbox.moe/x01wul.mp3"
  },
  {
    title: "Namami Shamishan",
    url: "https://files.catbox.moe/3ltxq1.mp3"
  },
  {
    title: "Om Namah Shivay",
    url: "https://files.catbox.moe/8q7tst.mp3"
  },
  {
    title: "Rudrashtakam",
    url: "https://files.catbox.moe/lkkrry.mp3"
  },
  {
    title: "Shankar Teri Jata Me",
    url: "https://files.catbox.moe/oh8tto.mp3"
  },
  {
    title: "Shiv Kailash",
    url: "https://files.catbox.moe/nposd9.mp3"
  },
  {
    title: "Shiv Kailasho Ke Vasi",
    url: "https://files.catbox.moe/1uf6cm.mp3"
  },
  {
    title: "Shiv Tandav Stotram",
    url: "https://files.catbox.moe/yu9snz.mp3"
  },
  {
    title: "Shiv Tandav Stotram",
    url: "https://files.catbox.moe/bf1cjc.mp3"
  },
  {
    title: "Shivji Ki Sawari Aayi Bhole Ki Sawari",
    url: "https://files.catbox.moe/nypupo.mp3"
  },
  {
    title: "Shree Rudraashtakam",
    url: "https://files.catbox.moe/6ktyzg.mp3"
  },
  {
    title: "Shree Shiv Panchakshram Stotram",
    url: "https://files.catbox.moe/t64m46.mp3"
  },
  {
    title: "नागेन्द्रहाराय त्रिलोचनाय",
    url: "https://files.catbox.moe/o20ukp.mp3"
  }
]


const audio = document.getElementById(
  "audio-player"
)

const playButton = document.getElementById(
  "play-btn"
)

const previousButton = document.getElementById(
  "prev-btn"
)

const nextButton = document.getElementById(
  "next-btn"
)

const muteButton = document.getElementById(
  "mute-btn"
)

const trackTitle = document.getElementById(
  "track-title"
)

const trackMeta = document.getElementById(
  "track-meta"
)

const currentTimeElement = document.getElementById(
  "current-time"
)

const durationElement = document.getElementById(
  "duration"
)

const progressTrack = document.getElementById(
  "progress-track"
)

const progressFill = document.getElementById(
  "progress-fill"
)

const queue = document.getElementById(
  "queue"
)

const backgrounds = Array.from(
  document.querySelectorAll(".bg")
)

const snowContainer = document.getElementById(
  "snow-container"
)


let currentTrack = 9

let currentBackground = 0


function formatTime(seconds) {

  if (
    !Number.isFinite(seconds)
  ) {
    return "0:00"
  }

  const minutes =
    Math.floor(seconds / 60)

  const remainingSeconds =
    Math.floor(seconds % 60)

  return (
    `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`
  )

}


function updatePlayButton() {

  if (
    audio.paused
  ) {

    playButton.innerHTML =
      '<span class="play-icon">▶</span>'

    playButton.setAttribute(
      "aria-label",
      "Play"
    )

    document.body.classList.remove(
      "is-playing"
    )

  } else {

    playButton.innerHTML =
      '<span class="play-icon">Ⅱ</span>'

    playButton.setAttribute(
      "aria-label",
      "Pause"
    )

    document.body.classList.add(
      "is-playing"
    )

  }

}


function renderQueue() {

  queue.innerHTML =
    tracks
      .map(
        (
          track,
          index
        ) => {

          const isActive =
            index === currentTrack

          const status =
            isActive &&
            !audio.paused
              ? "Playing"
              : "Play"

          return `
            <button
              type="button"
              data-track="${index}"
              class="${isActive ? "active" : ""}"
            >

              <span>
                ${String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <p>

                ${track.title}

                <small>
                  Online audio
                </small>

              </p>

              <time>
                ${status}
              </time>

            </button>
          `

        }
      )
      .join("")

}


function updateTrackInfo() {

  const track =
    tracks[currentTrack]

  trackTitle.textContent =
    track.title

  trackMeta.textContent =
    `Track ${currentTrack + 1} of ${tracks.length} · Online collection`

  currentTimeElement.textContent =
    "0:00"

  durationElement.textContent =
    "0:00"

  progressFill.style.width =
    "0%"

}


function loadTrack(
  index,
  shouldPlay = false
) {

  currentTrack =
    (
      index +
      tracks.length
    ) %
    tracks.length

  const track =
    tracks[currentTrack]

  audio.pause()

  updateTrackInfo()

  audio.src =
    track.url

  audio.load()

  renderQueue()

  const activeTrack =
    queue.querySelector(
      ".active"
    )

  if (
    activeTrack
  ) {

    activeTrack.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    })

  }

  if (
    shouldPlay
  ) {

    const startPlayback =
      () => {

        audio
          .play()
          .catch(
            error => {

              console.error(
                "Audio playback failed",
                error
              )

            }
          )

      }

    if (
      audio.readyState >= 2
    ) {

      startPlayback()

    } else {

      audio.addEventListener(
        "canplay",
        startPlayback,
        {
          once: true
        }
      )

    }

  }

}


function togglePlayback() {

  if (
    audio.paused
  ) {

    audio
      .play()
      .catch(
        error => {

          console.error(
            "Playback failed",
            error
          )

        }
      )

  } else {

    audio.pause()

  }

}


playButton.addEventListener(
  "click",
  togglePlayback
)


nextButton.addEventListener(
  "click",
  () => {

    loadTrack(
      currentTrack + 1,
      true
    )

  }
)


previousButton.addEventListener(
  "click",
  () => {

    loadTrack(
      currentTrack - 1,
      true
    )

  }
)


muteButton.addEventListener(
  "click",
  () => {

    audio.muted =
      !audio.muted

    muteButton.innerHTML =
      audio.muted
        ? "<span>◌</span>"
        : "<span>◉</span>"

  }
)


queue.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-track]"
      )

    if (
      !button
    ) {
      return
    }

    loadTrack(
      Number(
        button.dataset.track
      ),
      true
    )

  }
)


progressTrack.addEventListener(
  "click",
  event => {

    if (
      !audio.duration
    ) {
      return
    }

    const rect =
      progressTrack.getBoundingClientRect()

    const percentage =
      (
        event.clientX -
        rect.left
      ) /
      rect.width

    audio.currentTime =
      percentage *
      audio.duration

  }
)


audio.addEventListener(
  "loadedmetadata",
  () => {

    durationElement.textContent =
      formatTime(
        audio.duration
      )

  }
)


audio.addEventListener(
  "timeupdate",
  () => {

    currentTimeElement.textContent =
      formatTime(
        audio.currentTime
      )

    const percentage =
      audio.duration
        ? (
            audio.currentTime /
            audio.duration
          ) *
          100
        : 0

    progressFill.style.width =
      `${percentage}%`

  }
)


audio.addEventListener(
  "play",
  () => {

    updatePlayButton()

    renderQueue()

  }
)


audio.addEventListener(
  "pause",
  () => {

    updatePlayButton()

    renderQueue()

  }
)


audio.addEventListener(
  "ended",
  () => {

    loadTrack(
      currentTrack + 1,
      true
    )

  }
)


audio.addEventListener(
  "error",
  () => {

    console.error(
      "Unable to load audio",
      tracks[currentTrack].url
    )

  }
)


audio.volume = 0.7


/* BACKGROUND CROSSFADE */

function changeBackground() {

  const previous = currentBackground

  currentBackground =
    (currentBackground + 1) % backgrounds.length

  backgrounds[currentBackground].classList.add("active")

  backgrounds[previous].classList.remove("active")
}

setInterval(changeBackground, 12000)



/* PERSISTENT SNOW */

function random(
  minimum,
  maximum
) {

  return (
    Math.random() *
    (
      maximum -
      minimum
    )
  ) +
  minimum

}


function createSnow() {

  const snowAmount =
    window.innerWidth < 700
      ? 70
      : 110

  for (
    let index = 0;
    index < snowAmount;
    index++
  ) {

    const snowflake =
      document.createElement(
        "span"
      )

    snowflake.className =
      "snowflake"

    const size =
      random(
        1.5,
        5.5
      )

    const duration =
      random(
        7,
        18
      )

    const delay =
      random(
        -duration,
        0
      )

    snowflake.style.left =
      `${random(
        0,
        100
      )}%`

    snowflake.style.setProperty(
      "--size",
      `${size}px`
    )

    snowflake.style.setProperty(
      "--duration",
      `${duration}s`
    )

    snowflake.style.setProperty(
      "--delay",
      `${delay}s`
    )

    snowflake.style.setProperty(
      "--opacity",
      random(
        0.3,
        1
      ).toFixed(2)
    )

    snowflake.style.setProperty(
      "--blur",
      `${random(
        0,
        1.5
      ).toFixed(2)}px`
    )

    snowflake.style.setProperty(
      "--drift-one",
      `${random(
        -40,
        40
      ).toFixed(0)}px`
    )

    snowflake.style.setProperty(
      "--drift-two",
      `${random(
        -70,
        70
      ).toFixed(0)}px`
    )

    snowflake.style.setProperty(
      "--drift-three",
      `${random(
        -100,
        100
      ).toFixed(0)}px`
    )

    snowflake.style.setProperty(
      "--drift-four",
      `${random(
        -130,
        130
      ).toFixed(0)}px`
    )

    snowflake.style.setProperty(
      "--drift-five",
      `${random(
        -160,
        160
      ).toFixed(0)}px`
    )

    snowflake.style.setProperty(
      "--drift-six",
      `${random(
        -200,
        200
      ).toFixed(0)}px`
    )

    snowContainer.appendChild(
      snowflake
    )

  }

}


createSnow()


loadTrack(
  currentTrack
)

updatePlayButton()
