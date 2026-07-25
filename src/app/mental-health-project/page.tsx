import PageBanner from "@/components/common/PageBanner";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Mental Health Project - TUVAA",
  description:
    "TUVAA Mental Health Project supporting BAME communities with awareness, education, empowerment and access to support.",
};

// ── Section data ─────────────────────────────────────────────────────────────
const factorsSection = {
  heading: "Factors influencing access to mental health support services",
  subSections: [
    {
      title: "Definition of health",
      paragraphs: [
        `Mental health means different things to different people. For example some defined it positively such as cheerfulness, calmness, happiness, relaxed, lack of worries and financial stability. Others defined it negatively such as unable to deal with daily stress, caged, violence, dangerous, abnormal behaviour, lost it, naked walking on the road. Others defined it more holistic. Understanding mental health and its meaning from the perspectives of these participants is important, as it gives us access to their world and give us an insight into how they might be supported going forward.`,
      ],
    },
    {
      title: "Secrecy",
      paragraphs: [
        `Mental health in BME community is generally shrouded in secrecy and there appears to be several reasons for this. From some cultural perspectives, mental health is seen as a "big disability", and a taboo. It is against the norm to openly talk about it despite one's level of education and awareness. A sufferer is expected to put on a brave face, push it under the carpet and internalised or bottled up their emotions rather than talk about it. These expectations are adhered to and lived by people coming from such cultures.`,
        `Fear is also a major factor both leading to and reinforcing secrecy. This include fear of mistreatment and fear of been judged by family, friends, and religious communities. It appears to be a common experience in the community and in particular among people from faith groups. They are expected to rely on their faith to overcome any hurdles in their lives so people of faith in theory are not expected to experience mental health issues. Experiencing a mental health issue could be interpreted as weak in faith leading to potential discrimination and consequently reinforcing secrecy around mental health.`,
      ],
    },
    {
      title: "Stigma and Social Exclusion",
      paragraphs: [
        `There seems to be a general agreement that mental health is a stigmatised condition especially among the BAME communities. The negative stereotype associated with mental health forces people to dissociate themselves from anything to do with mental health, mental health services and support service. The risk of being provoked, insulted, called names or isolated occurs if one's mental status becomes public knowledge.`,
        `It was clear from participants that to be referred to as having "lost the plot" or "gone mad" was not helpful and obscured the real person behind mental health problem who was seen as a freak, weak or dangerous, or seen as someone no one understands, cannot talk, or relate to. This only served to reinforce the prejudice held about mental health.`,
      ],
    },
    {
      title: "Racism and discrimination",
      paragraphs: [
        `Racism is something that a few people spoke about directly and there was evidence of underlying concerns. These were expressed by participants as feeling being ignored, misunderstood, not listened to, and not knowing where and who to turn for help. These experiences and feelings were not exclusively directed to the participants and their families by the public but more so by the professionals. For example, a participant said:`,
        `"Just speaking to a doctor, they tend to look at us and think well we will give them this this will shut them up there are lots of medication we can't have but we are taking it and as a black person we go to the doctor and they don't understand firstly our culture is totally different and they don't understand the way we are putting things over, some of us can't explain ourselves properly and all this is perceived to be that we are not there. So, we are looked at differently Yeah, we are treated differently"`,
        `Clearly, within the BME communities sometimes the perception is that you are likely to receive unequal treatment due to assumptions, stereotypes, and structures policies and this can exacerbate anxiety and stress for families, carers, and their children with mental health issues. And may discourage them to access services.`,
      ],
    },
    {
      title: "Other factors influence access to mental health services too",
      paragraphs: [
        `There seems to be a lot of mistrust between the BAME community and mental health service providers and sometimes fear of the support they would receive from services if they should access them. This perspective has been captured well by the carers. A range of experiences were described by them: not knowing how services work, not knowing how to access support and 'feeling scared'; trying to deal with things themselves and feeling a failure; concern about whether their son or daughter was given the right medication or even needed medication or needed to remain in hospital at all; lack of continuity in care of their loved ones.`,
      ],
    },
    {
      title: "Coping",
      paragraphs: [
        `Given the perceptions of the BAME communities outlined above, developing their own coping strategies to deal with issues of mental health and well-being seemed to have been influenced by culture and experience. People do seek family support but where there is lack of support within community, people adopt individualised ways of coping which might be regarded as resilience:`,
        `"As I said you don't really want to always look to someone you want to sort it yourself, speak to yourself and encourage yourself and say come on snap out of it, be strong. …it's also nice to encourage yourself because family and friends not going to be there for you all the time, so you got to do that yourself, help yourself in other words".`,
        `Where spirituality played an important role in the lives of participants, praying to their God or Allah, reading the Quran helped. When support from family or community was lacking, going out and seeing people around you chatting with them laughing "that also takes the stress out of you".`,
        `Seeking medical help was seen for some as a last resort for which there might be adverse consequences such as overdosing etc.`,
        `"I personally don't think that you should take tablets unless it is the last resort or go into to the doctor or something, unless it's something you can't do. If it is really getting really bad then you seek help and take tablets go to your Dr or probably end up into hospital. cause I just think that once you start taking the tablets, it's like a continuous thing isn't it".`,
      ],
    },
  ],
};

const recommendationSection = {
  heading: "Recommendation",
  subSections: [
    {
      title: "Education and training",
      paragraphs: [
        `The data indicated that participants' understanding of mental health and well-being vary from individual to individual as well as from community to community. Coupled with the high level of secrecy and stigma, cultural issues, and unwillingness to talk about the topic suggest that the BME community were left uncertain about how to communicate, how to access help or whether the services available were designed with them in mind.`,
        `Education and raising awareness received unanimous support. It was felt that this would help to break down the barriers of stigma, secrecy and promote open conversation and improve knowledge and ability to take appropriate actions.`,
        `Fear which also poses a strong barrier to accessing help and support could also be addressed by education. Participants also felt professionals could benefit from cultural appropriate training to improve interaction, communication, and service delivery. In some communities, places of worship were identified as the most appropriate venue. Participants also felt that raising awareness of mental health should be extended to schools where there were concerns about the early diagnosis and treatment of BME children with mental health issues.`,
      ],
    },
    {
      title: "Empowerment",
      paragraphs: [
        `We came from the same community where we conducted the research to understand our own problems. I believed this had enhanced self-confidence and the feelings of being in control.`,
        `Interestingly, Somali women's focus groups participants found the group interview empowering as that was the first time many of them were able to voice their views and concerns about mental health.`,
        `One recommendation from the participants was to provide a mixture of designated support groups i.e. family/carer groups, support groups linked to faith communities, and peer support. Other groups suggested the well-being support groups and a diversity walk group.`,
        `Support from mental health network, community well-being champions, advocates culturally sensitive in training and application would be enabling.`,
      ],
    },
    {
      title: "Professional and community interface",
      paragraphs: [
        `In order to access mental health services and professional support, building trust between professionals and communities is vital. Especially where the communities' experience and understanding of mental health differ from the professionals. Participants want professionals to be active listeners and show empathy when responding to the mental health needs of these communities.`,
        `Language, culture, and faith were seen as very important factors doctors must consider and valued. Some carers felt that patient confidentiality kept them in the dark and confused about the treatment their loved ones were receiving. There was also a strong need for continuity in care voiced by Afro-Caribbean women who were carers and family members, their experience of lack of which they felt increased anxiety and helplessness in both patient and family.`,
        `Environmental factors such as location for face-to-face contact was seen as problematic and participants felt that professionals coming into their communities would provide a greater incentive to access such treatments. The participants felt that a well-being Centre would help them to express their feelings and concern in a safe and non-judgmental environment.`,
        `There was a strong indication that the targeting of mental health services and projects in the BME communities were more likely to gain acceptance with the involvement and cooperation of religious and faith leaders. Some of these leaders themselves profess their lack of expertise and/or interest in mental health while others shared similar attitudes about mental health as their community. The authors nevertheless believe that their role should not be underestimated and can be instrumental in reaching their communities.`,
        `They felt that support groups needed to be closed groups i.e. men/women/youth/elderly where cultural considerations and in some case ethnicity might be a prerequisite.`,
      ],
    },
    {
      title: "Next step",
      paragraphs: [
        `A celebration and thank you event for the participants who took part and opportunity to share findings with wider stakeholders to validate the data – took place.`,
        `Consideration of how to action the recommendations – work together moving forward – carers group was set up.`,
        `Mental Health Awareness Event – took place.`,
      ],
    },
  ],
};

// ── Shared sub-section renderer ───────────────────────────────────────────────
function SubSection({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <div className="mb-8">
      <h3 className="font-cinzel text-[16px] sm:text-[18px] font-bold text-[#35170f] uppercase tracking-wide mb-1 leading-snug">
        {title}
      </h3>
      <div className="w-8 h-[2px] bg-[#DB9E30] mb-4" />
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`text-[14.5px] sm:text-[15px] leading-[1.85] text-[#6b6560] ${
            p.startsWith('"') || p.startsWith('\u201c')
              ? 'italic border-l-4 border-[#DB9E30]/40 pl-4 bg-[#fdf8f2] py-2 pr-3 rounded-r-sm'
              : ''
          } ${i < paragraphs.length - 1 ? 'mb-4' : ''}`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

// ── Big centered section heading ──────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center my-10">
      <h2 className="font-cinzel text-[19px] sm:text-[23px] md:text-[26px] font-bold uppercase text-[#35170f] tracking-wide leading-snug">
        {children}
      </h2>
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="h-[1px] w-16 bg-[#DB9E30]/50" />
        <div className="h-[3px] w-10 bg-[#DB9E30] rounded-full" />
        <div className="h-[1px] w-16 bg-[#DB9E30]/50" />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MentalHealthPage() {
  return (
    <main className="w-full bg-white">
      <PageBanner
        title="Mental Health Project"
        breadcrumb="Mental health project"
      />

      {/* ── Intro Section ── */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8 pt-14 pb-4 md:pt-20">
          <article className="text-[14.5px] sm:text-[15px] leading-[1.85] text-[#6b6560]">
            {/* Float image left */}
            <div className="mb-6 md:float-left md:mb-4 md:mr-9 md:w-[300px]">
              <Image
                src="/images/youth.jpg"
                alt="Mental Health Project – TUVAA"
                width={360}
                height={270}
                priority
                className="h-auto w-full rounded-sm object-cover shadow-[0_8px_28px_rgba(0,0,0,0.14)]"
              />
            </div>

            <p className="mb-5">
              TUVAA has forged and established partnerships with various groups
              and organisations with similar interests, for example, St Denis
              Activity club which helps black people to access mental health
              services. In 2021 St. Denis approached TUVAA to work with them to
              conduct BAME mental health survey in Southampton. The aim was to
              understand barriers to accessing mental health services and
              support. See the summary report.
            </p>
            <p className="mb-5">
              Our support circles provide regular group therapy and peer
              mentoring sessions. In addition to dialogue, we incorporate
              physical health activities. We run highly popular swimming classes
              designed specifically for Black men and women, promoting physical
              exercise as a therapeutic tool to enhance mental well-being and
              build water confidence.
            </p>
            <p>
              TUVAA also provides educational mental health workshops, connects
              members to professional clinical counselling, and runs confidential
              peer support sessions to address mental health challenges and
              eliminate stigmas within our communities.
            </p>
          </article>
        </div>
      </section>

      {/* ── Factors Section ── */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8 clear-both">
          <SectionHeading>{factorsSection.heading}</SectionHeading>
          {factorsSection.subSections.map((sub) => (
            <SubSection key={sub.title} title={sub.title} paragraphs={sub.paragraphs} />
          ))}
        </div>
      </section>

      {/* ── Recommendation Section ── */}
      <section className="w-full bg-[#fdf8f2]">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8 py-2">
          <SectionHeading>{recommendationSection.heading}</SectionHeading>
          {recommendationSection.subSections.map((sub) => (
            <SubSection key={sub.title} title={sub.title} paragraphs={sub.paragraphs} />
          ))}
        </div>
      </section>

      {/* ── Back to Projects ── */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8 py-10">
          <div className="border-t border-[#e8e0d4] pt-8">
            <Link
              href="/our-projects"
              className="btn-primary-hover inline-flex items-center gap-2 rounded-sm px-7 py-3 text-sm font-semibold"
            >
              ← Back to Our Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}