import React from "react";
import "./App.css";
import { Video } from "./components/Video";

export interface IVideo {
  title: string;
  summary: string;
  videoUrl: string;
  videoTitle: string;
}

const videos: IVideo[] = [
  {
    title:
      "David Deutsch Discusses Modes of Explanation in Science and Computation",
    summary:
      "Based on your interest in David Deutsch's work and your appreciation for his perspectives on knowledge creation, evident through your tweets, this clip discussing the role of computation in understanding systems and validating theories aligns perfectly with your interests.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=2585s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "David Deutsch on AGI and Knowledge Creation",
    summary:
      "Given your interest in 'effective acceleration' and knowledge creation as mentioned in your conversations, this clip related to how AGI (Artificial General Intelligence) can exhibit behaviours of creating new knowledge, would likely be interesting.",
    videoUrl: "https://www.youtube.com/watch?v=YyxepLfH1ZU&t=1087s",
    videoTitle: "David Deutsch: Knowledge Creation and The Human Race, Part 1",
  },
  {
    title: "The Importance of Knowledge Creation: David Deutsch's Perspective",
    summary:
      "Given your advocacy of accelerating the creation of knowledge as highlighted in your Twitter discussions, this clip highlighting David Deutsch's thoughts on knowledge creation, its importance, and its resilience against superficial arguments will be of interest to you.",
    videoUrl: "https://www.youtube.com/watch?v=YyxepLfH1ZU&t=1456s",
    videoTitle: "David Deutsch: Knowledge Creation and The Human Race, Part 1",
  },
  {
    title: "Knowledge Creation vs Biological Evolution",
    summary:
      "This clip further elaborates on the conversation around knowledge creation, contrasting human creative thought and biological evolution, which directly ties into the topic that you seem interested in.",
    videoUrl: "https://www.youtube.com/watch?v=YyxepLfH1ZU&t=486s",
    videoTitle: "David Deutsch: Knowledge Creation and The Human Race, Part 1",
  },
  {
    title: "David Deutsch on Creativity in Economics and Behaviour",
    summary:
      "Given your interest in effectively accelerating creation of knowledge over reduction of entropy, and your tweeted appreciation for David Deutsch's work, this clip discussing creativity as an important aspect in the economic landscape will catch your interest.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=4327s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "David Deutsch on Creation and Criticism of Knowledge",
    summary:
      "Your tweets indicate a deep interest in the philosophy and process of knowledge creation, referring specifically to David Deutsch's work. These cues explore his perspective on moral knowledge, its conjectural nature and our capability to refine what we know through criticism and iteration.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=1690s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "Exploring Models with Fusion Quill",
    summary:
      "Considering your interest in AI models, such as MistralAI, this clip provides a detailed explanation of how Fusion Quill provides an interface to interact with various AI models. This could offer a solution to your sentiment of 'too many models, too little time to play with them'.",
    videoUrl: "https://www.youtube.com/watch?v=883IoDlRzpM&t=0s",
    videoTitle:
      "Magic of AI with Fusion Quill using AI Models like ChatGPT, Mistral, Stable Diffusion and Whisper",
  },
  {
    title: "David Deutsch on Knowledge Creation and Structure",
    summary:
      "This clip might be interesting to you given your recent discussions about e/acc and its focus on effectively accelerating the creation of knowledge, a topic that Deutsch touches on.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=5565s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "Understanding humans: Knowledge Creation & Exceptionality",
    summary:
      "Given the user's tweets about effective acceleration and the creation of knowledge, particularly in relation to David Deutsch's work, this clip which discusses humans, knowledge creation and our exceptionality fits perfectly with their interests.",
    videoUrl: "https://www.youtube.com/watch?v=YyxepLfH1ZU&t=64s",
    videoTitle: "David Deutsch: Knowledge Creation and The Human Race, Part 1",
  },
  {
    title: "David Deutsch: Enlightenment and Knowledge Creation",
    summary:
      "Your interest in the ideas of David Deutsch, as shown in your tweets where you mention his work, will be attracted towards this segment of the transcript. It discusses Deutsch's ideas about the acceleration of knowledge creation.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=23s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "David Deutsch's perspective on the creation of knowledge and AGI",
    summary:
      "Your tweets convey a keen interest in the concepts of effective acceleration and expanding human knowledge. David Deutsch, whom you mentioned specifically, discusses these subjects in this clip.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=444s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
  {
    title: "Knowledge, Prediction, and Ideologies in Context",
    summary:
      "Given your interest in knowledge creation espoused in the e/acc idea, the segment showcasing David Deutsch's perspectives on the power of explanatory knowledge and the limitations of ideologies in prediction might strike a chord.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=3529s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
  {
    title: "Knowledge and Its Influence on the Universe",
    summary:
      "The user's interest in knowledge creation and its impact makes this clip, which discusses how knowledge influences the physical universe and perpetuates itself in environments, highly relevant.",
    videoUrl: "https://www.youtube.com/watch?v=YyxepLfH1ZU&t=328s",
    videoTitle: "David Deutsch: Knowledge Creation and The Human Race, Part 1",
  },
  {
    title: "Halted Progress? On the Morality of Developing New Tech",
    summary:
      "Given your critiques of blindly accelerating technological progress, this conversation where Deutsch & Pinker discuss the appropriateness of halting or slowing the development of certain technologies will likely appeal to you.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=5296s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
  {
    title: "The Impact of David Deutsch's Work",
    summary:
      "The impact and importance of David Deutsch's work on individuals and broader communities are talked about in this segment. This should intrigue you as you have shown an interest in Deutsch's work in your tweets.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=117s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "Incorporating Personalization into LLM Recommendations",
    summary:
      "Your interests in recommendation systems, particularly language model-based systems like Open Recommender, are directly linked to the content of this clip which discusses personalization techniques for LLM recommendations.",
    videoUrl: "https://www.youtube.com/watch?v=FjTGiNfB2zw&t=424s",
    videoTitle: "How to Build Personalization into LLM Recommendations",
  },
  {
    title: "Knowledge Acceleration and Progress in Society",
    summary:
      "Considering both your tweets and engagement with the idea of 'effective acceleration', this clip discusses the progress in society and the acceleration of knowledge, aligning with your interests and the concept of e/acc.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=5402s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title:
      "Focus on Knowledge Creation: Deutsch and Pinker Discuss Explanatory Levels",
    summary:
      "In line with your interest in the creation of knowledge, as seen in your response to @gfodor, this clip discusses how explanations of high-level phenomena such as cognition, knowledge creation, and human behavior may not be reducible to lower-level substrates like neurophysiology.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=5046s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
  {
    title: "David Deutsch: The Role of Knowledge in Society",
    summary:
      "In your tweet, you mention David Deutsch and emphasize the importance of accelerating knowledge creation. This clip covers Deutsch's thoughts on the same topic and how knowledge leads to wealth creation, resources and how human error could potentially hinder knowledge creation.",
    videoUrl: "https://www.youtube.com/watch?v=YyxepLfH1ZU&t=764s",
    videoTitle: "David Deutsch: Knowledge Creation and The Human Race, Part 1",
  },
  {
    title: "David Deutsch on Genetic Influence and Behaviour",
    summary:
      "A second clip aligns with your discussion on the impact of genetic influences on behaviours, where David Deutsch talks about how genetic knowledge can be overwritten and the resulting implications.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=4986s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "David Deutsch on Constructor Theory",
    summary:
      "In these discourse on constructor theory by David Deutsch could relate to your thread on effective accelerationism and Deutsch's ideas. Expecially considering your discussion on accelerating the creation of knowledge.",
    videoUrl: "https://www.youtube.com/watch?v=Q_Cs5iNazB8&t=2175s",
    videoTitle: "Theory of Anything Hosts David Deutsch",
  },
  {
    title: "David Deutsch on Creativity and Genetic Contributions",
    summary:
      "Given your affection for david deutsch's work and your interest in knowledge creation, which Deutsch discusses in depth in this clip, you would likely be interested in hearing more about these topics from him.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=3886s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
  {
    title: "David Deutsch on AI Doom and Predictions",
    summary:
      "Based on your interest in topics related to 'Effective Acceleration' and 'David Deutsch's work', this clip provides valuable insights from David Deutsch on the complexities of predicting AI Doom and the subjective interpretations of prediction markets.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=3035s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
  {
    title: "David Deutsch's Take on AI Safety and AGI",
    summary:
      "Considering your interest in David Deutsch's work and e/acc, this clip provides insight on Deutsch's view on AI safety, focusing on the inherent risks and the need for more comprehensive safety measures.",
    videoUrl: "https://www.youtube.com/watch?v=3Ho-vJZsMgk&t=2267s",
    videoTitle:
      "David Deutsch & Steven Pinker (First Ever Public Dialogue) – AGI, P(Doom), & The Enemies of Progress",
  },
];

function App() {
  const videoRefs = React.useRef<HTMLDivElement[]>([]);
  const [inViewIndex, setInViewIndex] = React.useState<number>(0);
  const appVideosRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observerOptions = {
      root: appVideosRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Adjust this value to change the scroll trigger point
    };

    // This function handles the intersection of videos
    const handleIntersection = () => {
      setTimeout(() => {
        videoRefs.current.forEach((videoRef, index) => {
          const top = videoRef.getBoundingClientRect().top;
          if (top > 0 && top < window.innerHeight) {
            console.log(index, top, window.innerHeight);
            setInViewIndex(index);
          }
        });
      }, 1000);
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // We observe each video reference to trigger play/pause
    videoRefs.current.forEach((videoRef) => {
      observer.observe(videoRef);
    });

    // We disconnect the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [videos, appVideosRef.current]);

  // This function handles the reference of each video
  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  return (
    <div className="app">
      <div ref={appVideosRef} className="app__videos">
        {videos.map((vid, i) => (
          <Video
            setVideoRef={handleVideoRef(i)}
            video={vid}
            key={i}
            inView={inViewIndex === i}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
