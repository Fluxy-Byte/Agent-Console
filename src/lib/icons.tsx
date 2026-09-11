// Ícones do app — extraídos estaticamente do pacote lineicons-react (plano
// gratuito) e reescritos como componentes React 19 puros deste projeto.
//
// POR QUE NÃO IMPORTAR lineicons-react DIRETO: seu dist/index.js é buildado
// com esbuild --bundle SEM externalizar "react", embutindo uma cópia inteira
// do React 18.2.0 dentro do pacote. Isso faz os elementos criados pelos
// ícones vierem de uma instância de React diferente da instância do app
// (React 19) e o React em runtime rejeita com "Minified React error #525:
// A React Element from an older version of React was rendered." — trava a
// aplicação inteira ao abrir qualquer tela com ícone. Extrair só o markup
// SVG (path + viewBox) e renderizar com o JSX/React do PRÓPRIO app elimina
// o problema de raiz — sem depender do bundle quebrado do pacote.
//
// Cada símbolo abaixo tem o MESMO NOME que tinha no lucide-react — os
// arquivos que consomem ícones só trocaram o import de "lucide-react" pra
// "@/lib/icons", sem precisar mudar nenhum uso.
//
// Como os paths já saem com fill="currentColor" (em vez do fill fixo
// "#323544" do pacote original), classes de cor (text-primary,
// text-destructive etc.) funcionam direto — sem CSS extra.
//
// Limitações do plano gratuito do lineicons-react (só ~600 ícones): alguns
// conceitos não têm equivalente exato e usam o ícone mais próximo
// disponível — documentado em cada alias abaixo.
import type { SVGProps } from "react";

export type IconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

function IconInfo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12.314 6.19ZM11.563 18.89a.75.75 0 1 0 1.5 0V8.39a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0 0 1.5h.75v9.75Z" />
    </svg>
  );
}

function IconArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M3.578 12.498c0 .193.073.385.22.532l5.996 6a.75.75 0 0 0 1.06-1.06l-4.72-4.724H20.33a.75.75 0 0 0 0-1.5H6.143l4.713-4.716a.75.75 0 1 0-1.061-1.06l-5.95 5.953a.748.748 0 0 0-.266.573v.002Z" />
    </svg>
  );
}

function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M21.08 12.519a.747.747 0 0 1-.22.51l-5.996 6.001a.75.75 0 0 1-1.061-1.06l4.72-4.724H4.328a.75.75 0 0 1 0-1.5h14.188L13.803 7.03a.75.75 0 1 1 1.06-1.06l5.95 5.953a.748.748 0 0 1 .266.596Z" />
    </svg>
  );
}

function IconCheckCircle1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M15.507 10.524a.75.75 0 1 0-1.06-1.06l-3.482 3.481-1.411-1.41a.75.75 0 0 0-1.061 1.06l1.942 1.941a.75.75 0 0 0 1.06 0l4.012-4.011Z" />
      <path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM3.5 12a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0Z" clipRule="evenodd" />
    </svg>
  );
}

function IconBarChart4(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M3.5 5.25a.75.75 0 0 0-1.5 0v12a2.25 2.25 0 0 0 2.25 2.25h17a.75.75 0 0 0 0-1.5h-17a.75.75 0 0 1-.75-.75v-12Z" />
      <path fill="currentColor" fillRule="evenodd" d="M7 10.277a2 2 0 0 0-2 2v3.473c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75v-3.473a2 2 0 0 0-2-2Zm-.5 2a.5.5 0 0 1 1 0V15h-1v-2.723ZM10.5 6.5a2 2 0 1 1 4 0v9.25a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75V6.5Zm2-.5a.5.5 0 0 0-.5.5V15h1V6.5a.5.5 0 0 0-.5-.5ZM18 8.059a2 2 0 0 0-2 2v5.691c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75V10.06a2 2 0 0 0-2-2Zm-.5 2a.5.5 0 0 1 1 0V15h-1V10.06Z" clipRule="evenodd" />
    </svg>
  );
}

function IconBulb2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M9.063 18.045c-.046-1.131-.794-2.194-1.803-3.18a7.5 7.5 0 1 1 10.48 0c-1.041 1.017-1.805 2.117-1.805 3.29v1.595a2.25 2.25 0 0 1-2.25 2.25h-2.373a2.25 2.25 0 0 1-2.25-2.25v-1.705ZM6.5 9.5a5.98 5.98 0 0 0 1.808 4.293c.741.724 1.512 1.633 1.933 2.707h1.509v-4.659a2.242 2.242 0 0 1-.841-.53l-.846-.846a.75.75 0 1 1 1.061-1.06l.846.845a.75.75 0 0 0 1.06 0l.846-.846a.75.75 0 1 1 1.06 1.06l-.845.846a2.24 2.24 0 0 1-.841.531V16.5h1.509c.421-1.074 1.192-1.984 1.933-2.707A6 6 0 1 0 6.5 9.5Zm4.063 8.713v1.537c0 .414.335.75.75.75h2.372a.75.75 0 0 0 .75-.75V18h-3.873v.017a4.17 4.17 0 0 1 0 .196Z" />
    </svg>
  );
}

function IconBulb4(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M9.063 18.045c-.046-1.131-.794-2.194-1.803-3.18a7.5 7.5 0 1 1 10.48 0c-1.041 1.017-1.805 2.117-1.805 3.29v1.595a2.25 2.25 0 0 1-2.25 2.25h-2.373a2.25 2.25 0 0 1-2.25-2.25v-1.705ZM6.5 9.5a5.98 5.98 0 0 0 1.808 4.293c.741.724 1.512 1.633 1.933 2.707h4.518c.421-1.074 1.192-1.984 1.933-2.707A6 6 0 1 0 6.5 9.5Zm4.063 8.713v1.537c0 .414.335.75.75.75h2.372a.75.75 0 0 0 .75-.75V18h-3.873v.017a4.17 4.17 0 0 1 0 .196ZM1.75 9.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM4.215 3.85a.75.75 0 1 0-.75 1.3l.866.5a.75.75 0 1 0 .75-1.3l-.866-.5ZM3.19 14.875a.75.75 0 0 1 .275-1.024l.866-.5a.75.75 0 0 1 .75 1.298l-.866.5a.75.75 0 0 1-1.025-.274ZM21.5 8.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5h-1ZM19.645 13.625a.75.75 0 0 1 1.025-.274l.866.5a.75.75 0 1 1-.75 1.298l-.866-.5a.75.75 0 0 1-.275-1.024ZM19.92 4.35a.75.75 0 0 0 .75 1.3l.866-.5a.75.75 0 1 0-.75-1.3l-.866.5Z" />
    </svg>
  );
}

function IconBuildings1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12.75 14.667a.75.75 0 0 1 .75-.75h3a.75.75 0 1 1 0 1.5h-3a.75.75 0 0 1-.75-.75ZM13.5 8.583a.75.75 0 0 0 0 1.5h3a.75.75 0 1 0 0-1.5h-3Z" />
      <path fill="currentColor" d="M11.5 3.25A2.25 2.25 0 0 0 9.25 5.5v2.25H5.5A2.25 2.25 0 0 0 3.25 10v10c0 .414.336.75.75.75h16a.75.75 0 0 0 .75-.75V5.5a2.25 2.25 0 0 0-2.25-2.25h-7Zm-2.25 16h-4.5V10a.75.75 0 0 1 .75-.75h3.75v2.25H7.756a.75.75 0 0 0 0 1.5H9.25v2.5H7.756a.75.75 0 0 0 0 1.5H9.25v2.25Zm1.5-6.973a.824.824 0 0 0 0-.054V5.5a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 .75.75v13.75h-8.5v-2.973a.824.824 0 0 0 0-.054v-3.946Z" />
    </svg>
  );
}

function IconCalendarDays(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M7.185 12.75a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM7.985 15.95a.8.8 0 0 0 0 1.6h.01a.8.8 0 0 0 0-1.6h-.01ZM11.195 12.75a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM11.995 15.95a.8.8 0 0 0 0 1.6h.01a.8.8 0 0 0 0-1.6h-.01ZM15.205 12.75a.8.8 0 0 1 .8-.8h.01a.8.8 0 0 1 0 1.6h-.01a.8.8 0 0 1-.8-.8ZM16.005 15.95a.8.8 0 0 0 0 1.6h.01a.8.8 0 0 0 0-1.6h-.01Z" />
      <path fill="currentColor" d="M8.75 2.75a.75.75 0 0 0-1.5 0v1H5.5A2.25 2.25 0 0 0 3.25 6v13a2.25 2.25 0 0 0 2.25 2.25h13A2.25 2.25 0 0 0 20.75 19V6a2.25 2.25 0 0 0-2.25-2.25h-1.75v-1a.75.75 0 0 0-1.5 0v1h-6.5v-1Zm10.5 5.5H4.75V6a.75.75 0 0 1 .75-.75h13a.75.75 0 0 1 .75.75v2.25Zm-14.5 1.5h14.5V19a.75.75 0 0 1-.75.75h-13a.75.75 0 0 1-.75-.75V9.75Z" />
    </svg>
  );
}

function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M19.28 6.763a.75.75 0 0 1 0 1.06L9.863 17.24a.75.75 0 0 1-1.06 0L4.72 13.157a.75.75 0 0 1 1.06-1.06l3.553 3.552 8.887-8.886a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );
}

function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M5.548 9.095a.75.75 0 0 1 1.06 0l5.72 5.72 5.72-5.72a.75.75 0 0 1 1.06 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0l-6.25-6.25a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}

function IconChevronUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M19.108 14.905a.75.75 0 0 1-1.06 0l-5.72-5.72-5.72 5.72a.75.75 0 0 1-1.06-1.06l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06Z" />
    </svg>
  );
}

function IconAngleDoubleLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M13.733 6.78a.75.75 0 0 0-1.06-1.06l-6.25 6.25a.75.75 0 0 0 0 1.06l6.25 6.25a.75.75 0 0 0 1.06-1.06l-5.72-5.72 5.72-5.72Z" />
      <path fill="currentColor" d="M18.233 6.78a.75.75 0 0 0-1.06-1.06l-6.25 6.25a.75.75 0 0 0 0 1.06l6.25 6.25a.75.75 0 0 0 1.06-1.06l-5.72-5.72 5.72-5.72Z" />
    </svg>
  );
}

function IconAngleDoubleRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M6.423 18.22a.75.75 0 1 0 1.06 1.06l6.25-6.25a.75.75 0 0 0 0-1.06l-6.25-6.25a.75.75 0 0 0-1.06 1.06l5.72 5.72-5.72 5.72Z" />
      <path fill="currentColor" d="M10.923 18.22a.75.75 0 1 0 1.06 1.06l6.25-6.25a.75.75 0 0 0 0-1.06l-6.25-6.25a.75.75 0 0 0-1.06 1.06l5.72 5.72-5.72 5.72Z" />
    </svg>
  );
}

function IconMinusCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M8.558 11.25a.75.75 0 0 0 0 1.5h6.884a.75.75 0 0 0 0-1.5H8.558Z" />
      <path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM3.5 12a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0Z" clipRule="evenodd" />
    </svg>
  );
}

function IconStopwatch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M9.749 2.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75ZM11.248 13.25a.75.75 0 0 0 1.5 0V8.496a.75.75 0 1 0-1.5 0v4.756Z" />
      <path fill="currentColor" fillRule="evenodd" d="M11.999 4.502a8.749 8.749 0 1 0 6.694 3.115l1.339-1.339a.75.75 0 0 0-1.061-1.06l-1.339 1.338A8.714 8.714 0 0 0 12 4.502ZM4.75 13.25a7.249 7.249 0 1 1 14.498 0 7.249 7.249 0 0 1-14.498 0Z" clipRule="evenodd" />
    </svg>
  );
}

function IconTargetUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M10.384 9.86a1.616 1.616 0 1 1 3.232 0 1.616 1.616 0 0 1-3.232 0ZM10.786 12.087a2.238 2.238 0 0 0-2.238 2.238v.93c0 .415.336.75.75.75h5.405a.75.75 0 0 0 .75-.75v-.93a2.238 2.238 0 0 0-2.239-2.238h-2.428Zm-.738 2.238c0-.407.33-.738.738-.738h2.428c.408 0 .739.33.739.738v.18h-3.905v-.18Z" />
      <path fill="currentColor" d="M12.75 2a.75.75 0 0 0-1.5 0v1.282a8.752 8.752 0 0 0-7.968 7.968H2a.75.75 0 0 0 0 1.5h1.282a8.752 8.752 0 0 0 7.968 7.968V22a.75.75 0 0 0 1.5 0v-1.282a8.752 8.752 0 0 0 7.968-7.968H22a.75.75 0 0 0 0-1.5h-1.282a8.752 8.752 0 0 0-7.968-7.968V2Zm-7.5 10.75a.75.75 0 0 0 0-1.5h-.462a7.253 7.253 0 0 1 6.462-6.462v.462a.75.75 0 0 0 1.5 0v-.462a7.253 7.253 0 0 1 6.462 6.462h-.462a.75.75 0 0 0 0 1.5h.462a7.253 7.253 0 0 1-6.462 6.462v-.462a.75.75 0 0 0-1.5 0v.462a7.253 7.253 0 0 1-6.462-6.462h.462Z" />
    </svg>
  );
}

function IconClipboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M16.186 3.75A2.25 2.25 0 0 0 13.992 2h-3.937A2.25 2.25 0 0 0 7.86 3.75H6.773A2.25 2.25 0 0 0 4.523 6v13.75A2.25 2.25 0 0 0 6.773 22h10.5a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25h-1.087Zm-6.881.5a.75.75 0 0 1 .75-.75h3.937a.75.75 0 0 1 .75.75v.469a.75.75 0 0 1-.75.75h-3.937a.75.75 0 0 1-.75-.75V4.25Zm-1.437 1a2.25 2.25 0 0 0 2.187 1.719h3.937A2.25 2.25 0 0 0 16.18 5.25h1.094a.75.75 0 0 1 .75.75v13.75a.75.75 0 0 1-.75.75h-10.5a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75h1.095Z" />
    </svg>
  );
}

function IconDownload1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12.424 16.75a.748.748 0 0 1-.548-.237l-4.61-4.607a.75.75 0 0 1 1.061-1.061l3.347 3.345V4a.75.75 0 1 1 1.5 0v10.185l3.343-3.34a.75.75 0 1 1 1.06 1.06l-4.575 4.573a.748.748 0 0 1-.578.272Z" />
      <path fill="currentColor" d="M5.172 16a.75.75 0 0 0-1.5 0v2.5a2.25 2.25 0 0 0 2.25 2.25h13a2.25 2.25 0 0 0 2.25-2.25V16a.75.75 0 1 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-13a.75.75 0 0 1-.75-.75V16Z" />
    </svg>
  );
}

function IconEye(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M12.023 7.625a4.375 4.375 0 1 0 0 8.75 4.375 4.375 0 0 0 0-8.75ZM9.148 12a2.875 2.875 0 1 1 5.75 0 2.875 2.875 0 0 1-5.75 0Z" clipRule="evenodd" />
      <path fill="currentColor" fillRule="evenodd" d="M12.023 4.5c-4.312 0-8.025 2.556-9.722 6.235a3.022 3.022 0 0 0 0 2.53c1.697 3.679 5.41 6.235 9.722 6.235 4.312 0 8.026-2.556 9.723-6.235.37-.802.37-1.728 0-2.53-1.697-3.679-5.41-6.235-9.723-6.235Zm-8.36 6.863C5.125 8.194 8.32 6 12.023 6c3.704 0 6.899 2.194 8.36 5.363.187.404.187.87 0 1.274C18.923 15.806 15.728 18 12.024 18c-3.703 0-6.898-2.194-8.36-5.363a1.521 1.521 0 0 1 0-1.274Z" clipRule="evenodd" />
    </svg>
  );
}

function IconFileMultiple(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M16.892 16.733V4.25A2.25 2.25 0 0 0 14.642 2h-3.95a2.25 2.25 0 0 0-1.59.66L4.751 7.01a2.25 2.25 0 0 0-.658 1.59v8.132a2.25 2.25 0 0 0 2.25 2.25h8.298a2.25 2.25 0 0 0 2.25-2.25Zm-2.25.75H6.344a.75.75 0 0 1-.75-.75V8.731h2.98a2.25 2.25 0 0 0 2.25-2.251l-.001-2.98h3.82a.75.75 0 0 1 .75.75v12.483a.75.75 0 0 1-.75.75ZM6.653 7.231l2.67-2.672.002 1.922a.75.75 0 0 1-.75.75H6.653Z" />
      <path fill="currentColor" d="M18.407 5.684a.75.75 0 0 1 1.5 0v11.567a4.75 4.75 0 0 1-4.75 4.75h-7.36a.75.75 0 0 1 0-1.5h7.36a3.25 3.25 0 0 0 3.25-3.25V5.684Z" />
    </svg>
  );
}

function IconNotebook1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M6.75 2A2.25 2.25 0 0 0 4.5 4.25v2H3.25a.75.75 0 0 0 0 1.5H4.5v3.5H3.25a.75.75 0 0 0 0 1.5H4.5v3.5H3.25a.75.75 0 0 0 0 1.5H4.5v2A2.25 2.25 0 0 0 6.75 22h10.5a2.25 2.25 0 0 0 2.25-2.25V4.25A2.25 2.25 0 0 0 17.25 2H6.75ZM6 17.75h1.25a.75.75 0 0 0 0-1.5H6v-3.5h1.25a.75.75 0 0 0 0-1.5H6v-3.5h1.25a.75.75 0 0 0 0-1.5H6v-2a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v15.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-2Z" />
    </svg>
  );
}

function IconGauge1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M20.5 14.31a8.501 8.501 0 0 0-.793-3.583l-1.054.609a.75.75 0 1 1-.75-1.3l1.055-.608a8.501 8.501 0 0 0-6.208-3.584V7.06a.75.75 0 0 1-1.5 0V5.844a8.5 8.5 0 0 0-6.207 3.583l1.054.609a.75.75 0 0 1-.75 1.3l-1.054-.61a8.5 8.5 0 0 0 0 7.168l1.052-.607a.75.75 0 1 1 .75 1.299l-1.732 1a.75.75 0 0 1-1.044-.312 10 10 0 1 1 17.34.04.75.75 0 0 1-1.076.241l-1.68-.97a.75.75 0 0 1 .75-1.299l1.054.609a8.502 8.502 0 0 0 .793-3.584Z" />
      <path fill="currentColor" d="m12 10.186.664-.35a.75.75 0 0 0-1.327 0l.663.35Z" />
      <path fill="currentColor" fillRule="evenodd" d="m12 10.186-.663-.35-.001.003-.004.007-.014.026-.05.098a37.013 37.013 0 0 0-.726 1.483c-.198.43-.402.899-.558 1.323-.142.387-.289.85-.289 1.215a2.305 2.305 0 1 0 4.61 0c0-.365-.146-.828-.289-1.215-.155-.424-.359-.893-.557-1.323a36.959 36.959 0 0 0-.726-1.483l-.05-.098-.014-.026-.004-.007-.001-.003-.664.35Zm-.096 1.894.096-.207.097.207c.19.414.375.842.511 1.213.068.185.12.346.155.478a1.816 1.816 0 0 1 .042.22.805.805 0 0 1-1.61 0l.001-.015a1.823 1.823 0 0 1 .041-.206c.035-.13.087-.292.155-.477.136-.37.321-.799.512-1.213Z" clipRule="evenodd" />
    </svg>
  );
}

function IconHeadphone1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M12 3.25A8.75 8.75 0 0 0 3.25 12V17.25A2.25 2.25 0 0 0 5.5 19.5h1a2.25 2.25 0 0 0 2.25-2.25v-3.5A2.25 2.25 0 0 0 6.5 11.5h-1c-.26 0-.509.044-.74.125a7.25 7.25 0 0 1 14.48 0 2.247 2.247 0 0 0-.74-.125h-1a2.25 2.25 0 0 0-2.25 2.25v3.5a2.25 2.25 0 0 0 2.25 2.25h1a2.25 2.25 0 0 0 2.25-2.25V12A8.75 8.75 0 0 0 12 3.25Zm7.25 10.486v3.514a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.736ZM6.5 13a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-3.5A.75.75 0 0 1 5.5 13h1Z" clipRule="evenodd" />
    </svg>
  );
}

function IconServiceBell1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M11.25 7.532V6H10a.75.75 0 0 1 0-1.5h4A.75.75 0 0 1 14 6h-1.25v1.532a8.75 8.75 0 0 1 8 8.718V18h.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5h.5v-1.75a8.75 8.75 0 0 1 8-8.718ZM4.75 18h14.5v-1.75a7.25 7.25 0 1 0-14.5 0V18Z" clipRule="evenodd" />
    </svg>
  );
}

function IconHourglass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M4 3.25a.75.75 0 0 0 0 1.5h1.25V6a6.75 6.75 0 0 0 3.655 6 6.75 6.75 0 0 0-3.655 6v1.25H4a.75.75 0 0 0 0 1.5h16a.75.75 0 0 0 0-1.5h-1.25V18a6.75 6.75 0 0 0-3.655-6 6.75 6.75 0 0 0 3.655-6V4.75H20a.75.75 0 0 0 0-1.5H4Zm7.99 9.5h.02A5.25 5.25 0 0 1 17.25 18v1.25H6.75V18a5.25 5.25 0 0 1 5.24-5.25Zm.02-1.5h-.02A5.25 5.25 0 0 1 6.75 6V4.75h10.5V6a5.25 5.25 0 0 1-5.24 5.25Z" />
    </svg>
  );
}

function IconIdCard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M6.837 9.861a1.616 1.616 0 1 1 3.232 0 1.616 1.616 0 0 1-3.232 0Z" />
      <path fill="currentColor" fillRule="evenodd" d="M7.24 12.087A2.238 2.238 0 0 0 5 14.325v.93c0 .415.336.75.75.75h5.405a.75.75 0 0 0 .75-.75v-.93a2.238 2.238 0 0 0-2.238-2.238H7.239ZM6.5 14.325c0-.407.33-.738.738-.738h2.429c.407 0 .738.33.738.738v.18H6.501v-.18Z" clipRule="evenodd" />
      <path fill="currentColor" d="M19 10.501a.75.75 0 0 1-.75.75h-4.1a.75.75 0 0 1 0-1.5h4.1a.75.75 0 0 1 .75.75ZM16.15 14.251a.75.75 0 0 0 0-1.5h-2a.75.75 0 0 0 0 1.5h2Z" />
      <path fill="currentColor" fillRule="evenodd" d="M4.25 4.501A2.25 2.25 0 0 0 2 6.751v10.5a2.25 2.25 0 0 0 2.25 2.25h15.5a2.25 2.25 0 0 0 2.25-2.25v-10.5a2.25 2.25 0 0 0-2.25-2.25H4.25Zm-.75 2.25a.75.75 0 0 1 .75-.75h15.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-10.5Z" clipRule="evenodd" />
    </svg>
  );
}

function IconKey1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="m14.986 4.528 2.104 2.104-1.059 1.06-1.043-1.044a.75.75 0 1 0-1.06 1.06l1.043 1.044-2.334 2.334a5.374 5.374 0 1 0 1.06 1.06l6.044-6.043a.75.75 0 1 0-1.06-1.061l-.53.53-2.104-2.104a.75.75 0 0 0-1.06 1.06Zm-2.858 8.098.015.014.015.015a3.873 3.873 0 1 1-.03-.03Z" clipRule="evenodd" />
    </svg>
  );
}

function IconCheckSquare2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M20.75 18.5V8.678l-1.5 1.5V18.5a.75.75 0 0 1-.75.75h-13a.75.75 0 0 1-.75-.75v-13a.75.75 0 0 1 .75-.75h12.814l.98-.98c.09-.09.187-.172.288-.243A2.24 2.24 0 0 0 18.5 3.25h-13A2.25 2.25 0 0 0 3.25 5.5v13a2.25 2.25 0 0 0 2.25 2.25h13a2.25 2.25 0 0 0 2.25-2.25Z" />
      <path fill="currentColor" d="M20.484 6.519a.75.75 0 0 0-1.06-1.061l-7.494 7.493-3.353-3.353a.75.75 0 1 0-1.06 1.061l3.882 3.883a.75.75 0 0 0 1.061 0l8.024-8.023Z" />
    </svg>
  );
}

function IconSpinner3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5.75.75 0 0 1 1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2a.75.75 0 0 1 0 1.5Z" />
    </svg>
  );
}

function IconLocked1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12.75 15.5a.75.75 0 0 0-1.5 0v2a.75.75 0 0 0 1.5 0v-2Z" />
      <path fill="currentColor" d="M12 1.25A4.75 4.75 0 0 0 7.25 6v2.696a7.5 7.5 0 1 0 9.5 0V6A4.75 4.75 0 0 0 12 1.25ZM12 7a7.47 7.47 0 0 0-3.25.739V6a3.25 3.25 0 0 1 6.5 0v1.739A7.47 7.47 0 0 0 12 7Zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
    </svg>
  );
}

function IconEnter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M11.578 2.5a2.25 2.25 0 0 0-2.25 2.25v1.878c.12.081.235.175.342.282l1.158 1.159V4.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v15.5a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75v-3.319l-1.158 1.16c-.107.106-.221.2-.342.28v1.879a2.25 2.25 0 0 0 2.25 2.25h6a2.25 2.25 0 0 0 2.25-2.25V4.75a2.25 2.25 0 0 0-2.25-2.25h-6Z" />
      <path fill="currentColor" d="m7.548 15.97 2.718-2.72H4.328a.75.75 0 0 1 0-1.5h5.938L7.548 9.03a.75.75 0 0 1 1.06-1.06l3.964 3.966a.748.748 0 0 1-.002 1.13L8.61 17.03a.75.75 0 1 1-1.061-1.06Z" />
    </svg>
  );
}

function IconExit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M11.578 2.5a2.25 2.25 0 0 0-2.25 2.25v1.878c.12.081.235.175.342.282l1.158 1.159V4.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v15.5a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1-.75-.75v-3.319l-1.158 1.16c-.107.106-.221.2-.342.28v1.879a2.25 2.25 0 0 0 2.25 2.25h6a2.25 2.25 0 0 0 2.25-2.25V4.75a2.25 2.25 0 0 0-2.25-2.25h-6Z" />
      <path fill="currentColor" d="M3.578 12.5c0 .226.1.428.258.566l3.961 3.964a.75.75 0 1 0 1.061-1.06L6.14 13.25h5.938a.75.75 0 0 0 0-1.5H6.14l2.718-2.72a.75.75 0 0 0-1.06-1.06l-3.964 3.966a.748.748 0 0 0-.256.564Z" />
    </svg>
  );
}

function IconEnvelope1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M22 6.256V17.25a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.25V6.204A1.736 1.736 0 0 1 3.737 4.5h16.528c.959 0 1.736.777 1.736 1.735v.021ZM3.5 8.187v9.063c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V8.187l-7.213 5.03c-.773.54-1.8.54-2.574 0L3.5 8.187Zm17-1.958A.236.236 0 0 0 20.264 6H3.736a.236.236 0 0 0-.135.429l7.97 5.558c.258.18.6.18.858 0l7.97-5.558a.236.236 0 0 0 .101-.186V6.23Z" />
    </svg>
  );
}

function IconMegaphone1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M22.023 3.2a.75.75 0 1 0-1.5 0v.26l-10.29 3.438h-5.96a2.25 2.25 0 0 0-2.25 2.25v3.102a2.25 2.25 0 0 0 2.25 2.25h2.472l.438 3.095a2.216 2.216 0 1 0 4.38-.672l-.346-2.094 9.306 3.11v.26a.75.75 0 0 0 1.5 0v-15Zm-1.5 13.157-9.418-3.147V8.189l9.418-3.148v11.316ZM9.604 13h-5.33a.75.75 0 0 1-.75-.75V9.148a.75.75 0 0 1 .75-.75h5.33V13Zm.038 1.5.441 2.667a.716.716 0 1 1-1.415.217L8.26 14.5h1.382Z" />
    </svg>
  );
}

function IconChatBubble2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M15.511 3.332a4.835 4.835 0 0 0-4.525-1.182 4.837 4.837 0 0 0-3.478 3.42 3.377 3.377 0 0 0 .684 6.316 4.556 4.556 0 0 0 1.842 2.002 4.576 4.576 0 0 0 4.778-.127 3.407 3.407 0 0 0 4.673-1.89 3.378 3.378 0 0 0 .87-6.165 3.573 3.573 0 0 0-2.22-2.435 3.566 3.566 0 0 0-2.624.061Zm-.74 1.403a.75.75 0 0 0 .991.155 2.076 2.076 0 0 1 3.191 1.428.75.75 0 0 0 .436.572 1.877 1.877 0 0 1-.572 3.582.75.75 0 0 0-.66.597 1.907 1.907 0 0 1-2.836 1.266l-.185-.11a.75.75 0 0 0-.86.071 3.074 3.074 0 0 1-3.491.293 3.062 3.062 0 0 1-1.353-1.623.75.75 0 0 0-.632-.494 1.877 1.877 0 0 1-.408-3.647.75.75 0 0 0 .499-.578 3.339 3.339 0 0 1 5.88-1.512ZM4.75 20.75a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0ZM9.617 15.423a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 2.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" />
    </svg>
  );
}

function IconMessage2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M2.5 6a2.25 2.25 0 0 1 2.25-2.25h14.5A2.25 2.25 0 0 1 21.5 6v10.548a2.25 2.25 0 0 1-2.25 2.25H7.635L3.75 22.277a.75.75 0 0 1-1.25-.559V6Zm2.25-.75A.75.75 0 0 0 4 6v14.04l2.848-2.55a.75.75 0 0 1 .5-.192H19.25a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H4.75Z" clipRule="evenodd" />
    </svg>
  );
}

function IconMessage3Text(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M6.25 9.773a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75ZM7 12.023a.75.75 0 0 0 0 1.5h5a.75.75 0 1 0 0-1.5H7Z" />
      <path fill="currentColor" fillRule="evenodd" d="M2.5 5.531a2.25 2.25 0 0 1 2.25-2.25h14.5a2.25 2.25 0 0 1 2.25 2.25V16.08a2.25 2.25 0 0 1-2.25 2.25h-4.149l-2.499 3.366a.75.75 0 0 1-1.204 0L8.9 18.33H4.75a2.25 2.25 0 0 1-2.25-2.25V5.53Zm2.25-.75a.75.75 0 0 0-.75.75V16.08c0 .414.336.75.75.75h4.527a.75.75 0 0 1 .602.303L12 19.99l2.122-2.857a.75.75 0 0 1 .602-.303h4.526a.75.75 0 0 0 .75-.75V5.53a.75.75 0 0 0-.75-.75H4.75Z" clipRule="evenodd" />
    </svg>
  );
}

function IconComment1Text(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M7 10.597a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75ZM7.75 12.847a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5h-5Z" />
      <path fill="currentColor" fillRule="evenodd" d="M2.5 12.096a9.5 9.5 0 1 1 9.5 9.5H3.25a.75.75 0 0 1-.53-1.28l2.053-2.054A9.465 9.465 0 0 1 2.5 12.096Zm9.5-8a8 8 0 0 0-5.657 13.657.75.75 0 0 1 0 1.06l-1.282 1.283H12a8 8 0 1 0 0-16Z" clipRule="evenodd" />
    </svg>
  );
}

function IconMinus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M5.25 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75Z" />
    </svg>
  );
}

function IconMenuMeatballs2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M6.319 14.248a2.248 2.248 0 1 1 0-4.496 2.248 2.248 0 0 1 0 4.496ZM5.57 12a.748.748 0 1 0 1.497 0 .748.748 0 0 0-1.497 0ZM12.315 14.248a2.248 2.248 0 1 1 0-4.496 2.248 2.248 0 0 1 0 4.496ZM11.567 12a.748.748 0 1 0 1.496 0 .748.748 0 0 0-1.496 0ZM16.064 12a2.248 2.248 0 1 0 4.496 0 2.248 2.248 0 0 0-4.496 0Zm2.248.748a.748.748 0 1 1 0-1.496.748.748 0 0 1 0 1.496Z" clipRule="evenodd" />
    </svg>
  );
}

function IconVectorNodes6(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M9.377 6.5a2.751 2.751 0 0 1 5.293 0h2.853v-.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V8H14.67a2.738 2.738 0 0 1-.38.807 6.15 6.15 0 0 1 1.774.842c1.01.7 1.672 1.627 2.104 2.526A8.969 8.969 0 0 1 18.97 15h.803a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h.684a7.47 7.47 0 0 0-.641-2.175c-.349-.726-.86-1.425-1.607-1.943-.741-.514-1.76-.882-3.186-.882-1.425 0-2.444.368-3.186.882-.747.518-1.257 1.217-1.606 1.943A7.471 7.471 0 0 0 6.589 15h.684a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h.804a8.97 8.97 0 0 1 .802-2.825c.432-.9 1.094-1.825 2.104-2.526.51-.354 1.099-.642 1.774-.842A2.738 2.738 0 0 1 9.377 8H6.523v.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v.75h2.854Zm3.896.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0ZM17.523 18h1.5v-1.5h-1.5V18Zm-12.5 0h1.5v-1.5h-1.5V18Zm-1.5-10h1.5V6.5h-1.5V8Zm15.5 0h1.5V6.5h-1.5V8Z" />
    </svg>
  );
}

function IconPencil1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M19.303 3.78a2.25 2.25 0 0 0-3.182 0L14.35 5.551a.607.607 0 0 0-.033.033l-8.483 8.483a2.25 2.25 0 0 0-.562.936l-1.22 4.01a.75.75 0 0 0 .936.935l4.009-1.22c.353-.108.675-.3.936-.562L20.22 7.88a2.25 2.25 0 0 0 0-3.182l-.917-.917Zm-4.44 3.378 1.979 1.978-7.97 7.97a.75.75 0 0 1-.312.187l-2.664.81.811-2.663a.75.75 0 0 1 .187-.312l7.97-7.97Zm3.04.918-1.978-1.978L17.18 4.84a.75.75 0 0 1 1.061 0l.917.917a.75.75 0 0 1 0 1.06l-1.257 1.258Z" />
    </svg>
  );
}

function IconPhone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M11 17.5a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5h-2Z" />
      <path fill="currentColor" fillRule="evenodd" d="M8 2a2.25 2.25 0 0 0-2.25 2.25v15.5A2.25 2.25 0 0 0 8 22h8a2.25 2.25 0 0 0 2.25-2.25V4.25A2.25 2.25 0 0 0 16 2H8Zm-.75 2.25A.75.75 0 0 1 8 3.5h8a.75.75 0 0 1 .75.75v15.5a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V4.25Z" clipRule="evenodd" />
    </svg>
  );
}

function IconTelephone3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="m9.406 5.021.643 1.998c.051.158.103.383.071.64a2.096 2.096 0 0 1-1.344 1.709l-2.693 1.01a2.096 2.096 0 0 1-2.832-1.963V7.306c0-.607.28-1.206.81-1.574A13.875 13.875 0 0 1 12 3.25c2.95 0 5.688.917 7.941 2.482.53.368.81.967.81 1.574v1.109a2.096 2.096 0 0 1-2.833 1.962l-2.692-1.01a2.096 2.096 0 0 1-1.345-1.708c-.03-.257.02-.482.071-.64l.644-1.998a12.49 12.49 0 0 0-2.596-.271c-.89 0-1.758.093-2.595.271Zm-1.447.4a12.39 12.39 0 0 0-3.043 1.543.41.41 0 0 0-.165.342v1.109c0 .416.416.704.806.558l2.692-1.01a.596.596 0 0 0 .379-.462.36.36 0 0 0-.006-.022l-.663-2.057ZM15.38 7.48a.374.374 0 0 0-.006.022.596.596 0 0 0 .379.462l2.692 1.01a.596.596 0 0 0 .805-.558V7.306a.41.41 0 0 0-.164-.342 12.39 12.39 0 0 0-3.043-1.542l-.663 2.057ZM12.001 12.762a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5Zm-1.25 2.75a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0Z" clipRule="evenodd" />
      <path fill="currentColor" fillRule="evenodd" d="M9.994 10.53a5.25 5.25 0 0 1 4.015 0l4.815 1.993a2.25 2.25 0 0 1 1.332 1.572l.901 3.898a2.25 2.25 0 0 1-2.192 2.757H5.138a2.25 2.25 0 0 1-2.192-2.757l.9-3.897a2.25 2.25 0 0 1 1.332-1.573l4.816-1.992Zm3.441 1.387a3.75 3.75 0 0 0-2.867 0l-4.816 1.992a.75.75 0 0 0-.444.524l-.901 3.898a.75.75 0 0 0 .73.919h13.728a.75.75 0 0 0 .73-.92l-.9-3.897a.75.75 0 0 0-.444-.524l-4.816-1.992Z" clipRule="evenodd" />
    </svg>
  );
}

function IconPlug1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M14.5 2.75a.75.75 0 0 1 1.5 0v2.983h3.5a.75.75 0 0 1 0 1.5H19v5a6.501 6.501 0 0 1-5.75 6.457v2.56a.75.75 0 0 1-1.5 0v-2.56A6.501 6.501 0 0 1 6 12.233v-5h-.5a.75.75 0 0 1 0-1.5H9V2.75a.75.75 0 0 1 1.5 0v2.983h4V2.75Zm-7 4.483v5a5 5 0 0 0 10 0v-5h-10Z" clipRule="evenodd" />
    </svg>
  );
}

function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M11.25 6a.75.75 0 0 1 1.5 0v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 1 1-1.5 0v-5.25H6a.75.75 0 1 1 0-1.5h5.25V6Z" />
    </svg>
  );
}

function IconRefreshCircle1Clockwise(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M3.136 9.542a.75.75 0 1 0 1.45.388 8 8 0 0 1 15.251-.644l-1.675-.943a.75.75 0 1 0-.736 1.307l3.08 1.735a.75.75 0 0 0 1.022-.286l1.735-3.08a.75.75 0 0 0-1.307-.737l-.761 1.352a9.5 9.5 0 0 0-18.059.908ZM21.49 14.458a.75.75 0 1 0-1.448-.388 8 8 0 0 1-15.25.651l1.663.936a.75.75 0 0 0 .736-1.307l-3.08-1.734a.75.75 0 0 0-1.022.285l-1.735 3.081a.75.75 0 1 0 1.307.736l.767-1.362a9.5 9.5 0 0 0 18.063-.898Z" />
    </svg>
  );
}

function IconSearch1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M11.25 2.75C6.142 2.75 2 6.89 2 11.998s4.142 9.248 9.25 9.248a9.214 9.214 0 0 0 5.987-2.198l3.481 3.48a.75.75 0 1 0 1.06-1.06l-3.48-3.48a9.21 9.21 0 0 0 2.202-5.99c0-5.108-4.142-9.248-9.25-9.248ZM3.5 11.998a7.749 7.749 0 0 1 7.75-7.748 7.749 7.749 0 1 1 0 15.496 7.749 7.749 0 0 1-7.75-7.748Z" clipRule="evenodd" />
    </svg>
  );
}

function IconLocationArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M4.565 12.785c-1.916-.768-1.873-3.497.068-4.203L18.63 3.486c1.796-.654 3.538 1.088 2.884 2.884l-5.096 13.997c-.706 1.94-3.435 1.984-4.203.067l-2.069-5.163a.75.75 0 0 0-.417-.417l-5.164-2.07Zm.58-2.794c-.646.236-.66 1.145-.022 1.401l5.164 2.07a2.25 2.25 0 0 1 1.251 1.251l2.07 5.164c.256.638 1.165.624 1.4-.023l5.096-13.997a.75.75 0 0 0-.961-.961L5.146 9.99Z" clipRule="evenodd" />
    </svg>
  );
}

function IconShield2Check(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M15.507 9.776a.75.75 0 0 0-1.06-1.06l-3.482 3.48-1.411-1.41a.75.75 0 0 0-1.061 1.06l1.941 1.942a.75.75 0 0 0 1.061 0l4.012-4.012Z" />
      <path fill="currentColor" fillRule="evenodd" d="M12.86 2.296a2.25 2.25 0 0 0-1.721 0L4.59 5.01a2.184 2.184 0 0 0-1.362 1.944c-.134 4.54 1.204 10.818 7.707 14.57.66.382 1.475.378 2.132-.01 6.363-3.75 7.82-10.012 7.703-14.557-.023-.883-.585-1.625-1.361-1.947l-6.548-2.713Zm-1.147 1.386a.75.75 0 0 1 .574 0l6.548 2.713a.68.68 0 0 1 .436.6c.108 4.228-1.24 9.852-6.966 13.227a.616.616 0 0 1-.62.002c-5.843-3.371-7.083-8.988-6.958-13.227a.685.685 0 0 1 .437-.602l6.549-2.713Z" clipRule="evenodd" />
    </svg>
  );
}

function IconSlidersHorizontalSquare2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M14.313 7a.75.75 0 0 0-1.5 0v1.25h-5.5a.75.75 0 1 0 0 1.5h5.5V11a.75.75 0 0 0 1.5 0V7ZM17.313 8.25h-1.5v1.5h1.5a.75.75 0 0 0 0-1.5ZM9.56 12.25a.75.75 0 0 0-.75.75v1.25H7.313a.75.75 0 0 0 0 1.5h1.499V17a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75ZM11.809 14.25h5.504a.75.75 0 0 1 0 1.5h-5.504v-1.5Z" />
      <path fill="currentColor" fillRule="evenodd" d="M3.563 5.5a2.25 2.25 0 0 1 2.25-2.25h13a2.25 2.25 0 0 1 2.25 2.25v13a2.25 2.25 0 0 1-2.25 2.25h-13a2.25 2.25 0 0 1-2.25-2.25v-13Zm2.25-.75a.75.75 0 0 0-.75.75v13c0 .414.335.75.75.75h13a.75.75 0 0 0 .75-.75v-13a.75.75 0 0 0-.75-.75h-13Z" clipRule="evenodd" />
    </svg>
  );
}

function IconStarFat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M12 2.125a.75.75 0 0 1 .672.418l2.654 5.378 5.935.863a.75.75 0 0 1 .416 1.279l-4.294 4.186 1.013 5.911a.75.75 0 0 1-1.088.79L12 18.16 6.69 20.95a.75.75 0 0 1-1.088-.79l1.014-5.911-4.295-4.186a.75.75 0 0 1 .416-1.28l5.935-.862 2.654-5.378A.75.75 0 0 1 12 2.125Zm0 2.445L9.843 8.939a.75.75 0 0 1-.564.41l-4.822.7 3.49 3.401a.75.75 0 0 1 .215.664l-.824 4.802 4.313-2.267a.75.75 0 0 1 .698 0l4.312 2.267-.824-4.802a.75.75 0 0 1 .216-.664l3.489-3.4-4.822-.701a.75.75 0 0 1-.564-.41L12 4.569Z" clipRule="evenodd" />
    </svg>
  );
}

function IconLabelDollar2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12 8.25a.75.75 0 0 1 .75.75v.437c.99.151 1.75 1.007 1.75 2.04a.75.75 0 0 1-1.5 0 .563.563 0 0 0-.563-.563h-.687a.75.75 0 0 0-.75.75v.265a.75.75 0 0 0 .487.702l1.553.583a2.25 2.25 0 0 1 1.46 2.106v.265a2.25 2.25 0 0 1-1.75 2.195v.47a.75.75 0 0 1-1.5 0v-.438a2.063 2.063 0 0 1-1.75-2.04.75.75 0 0 1 1.5 0c0 .312.252.563.563.563h.687a.75.75 0 0 0 .75-.75v-.265a.75.75 0 0 0-.487-.702l-1.553-.582a2.25 2.25 0 0 1-1.46-2.107v-.265a2.25 2.25 0 0 1 1.75-2.194V9a.75.75 0 0 1 .75-.75Z" />
      <path fill="currentColor" fillRule="evenodd" d="M13.093 3.014a2.266 2.266 0 0 0-.193-.095v-.92a.9.9 0 1 0-1.8 0v.92c-.065.029-.13.06-.193.095l-5.25 2.917A2.25 2.25 0 0 0 4.5 7.898V19.75A2.25 2.25 0 0 0 6.75 22h10.5a2.25 2.25 0 0 0 2.25-2.25V7.898a2.25 2.25 0 0 0-1.157-1.967l-5.25-2.917ZM12 6.65a.9.9 0 0 0 .9-.9V4.623l4.714 2.62a.75.75 0 0 1 .386.655V19.75a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V7.898a.75.75 0 0 1 .386-.656L11.1 4.623V5.75a.9.9 0 0 0 .9.9Z" clipRule="evenodd" />
    </svg>
  );
}

function IconTicket1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M4.25 6a.75.75 0 0 0-.75.75v2.278a3.066 3.066 0 0 1 0 5.945v2.277c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75v-2.277a3.066 3.066 0 0 1 0-5.945V6.75a.75.75 0 0 0-.75-.75H4.25ZM2 6.75A2.25 2.25 0 0 1 4.25 4.5h15.5A2.25 2.25 0 0 1 22 6.75v2.936a.75.75 0 0 1-.75.75 1.565 1.565 0 0 0 0 3.13.75.75 0 0 1 .75.75v2.934a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 17.25v-2.934a.75.75 0 0 1 .75-.75 1.565 1.565 0 0 0 0-3.13.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
    </svg>
  );
}

function IconTrash3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M14.722 12.758a.75.75 0 0 0-1.498-.073L13 17.24a.75.75 0 0 0 1.498.074l.224-4.557ZM9.988 11.973a.75.75 0 0 0-.712.785l.224 4.557a.75.75 0 1 0 1.498-.074l-.224-4.556a.75.75 0 0 0-.786-.712Z" />
      <path fill="currentColor" d="M10.249 2a2.25 2.25 0 0 0-2.25 2.25V5H5.5a2.25 2.25 0 0 0-.587 4.423l.628 10.462A2.25 2.25 0 0 0 7.787 22h8.424a2.25 2.25 0 0 0 2.246-2.115l.628-10.462A2.25 2.25 0 0 0 18.498 5h-2.499v-.75A2.25 2.25 0 0 0 13.749 2h-3.5Zm4.25 3h-5v-.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75V5ZM5.5 6.5h12.998a.75.75 0 1 1 0 1.5H5.5a.75.75 0 0 1 0-1.5Zm.92 3h11.158l-.618 10.295a.75.75 0 0 1-.749.705H7.787a.75.75 0 0 1-.749-.705L6.42 9.5Z" />
    </svg>
  );
}

function IconUpload1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M12.424 3.25a.748.748 0 0 0-.548.237l-4.61 4.607a.75.75 0 1 0 1.061 1.061l3.347-3.345V16a.75.75 0 1 0 1.5 0V5.815l3.343 3.34a.75.75 0 1 0 1.06-1.06l-4.575-4.573a.748.748 0 0 0-.578-.272Z" />
      <path fill="currentColor" d="M5.172 16a.75.75 0 0 0-1.5 0v2.5a2.25 2.25 0 0 0 2.25 2.25h13a2.25 2.25 0 0 0 2.25-2.25V16a.75.75 0 1 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-13a.75.75 0 0 1-.75-.75V16Z" />
    </svg>
  );
}

function IconUser4(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M16.434 6.35c0 2.39-1.94 4.34-4.34 4.34l-.01-.01c-2.39 0-4.34-1.95-4.34-4.34 0-2.39 1.96-4.34 4.35-4.34 2.39 0 4.34 1.96 4.34 4.35Zm-1.5-.01c0-1.56-1.27-2.84-2.84-2.84-1.56 0-2.84 1.28-2.84 2.84 0 1.56 1.28 2.84 2.84 2.84a2.85 2.85 0 0 0 2.84-2.84Z" clipRule="evenodd" />
      <path fill="currentColor" d="M12.024 12.19c2.67 0 4.76.75 6.21 2.23v-.01c2.046 2.086 2.04 4.846 2.04 5.024v.005c-.01.41-.34.74-.75.74h-.01a.755.755 0 0 1-.74-.76c0-.05 0-2.33-1.62-3.97-1.16-1.17-2.89-1.77-5.13-1.77-2.24 0-3.97.6-5.13 1.77-1.62 1.65-1.62 3.95-1.62 3.97 0 .41-.33.76-.74.76-.36.02-.76-.32-.76-.73v-.004c-.001-.168-.008-2.939 2.04-5.026 1.45-1.48 3.54-2.23 6.21-2.23Z" />
    </svg>
  );
}

function IconUserMultiple4(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M15.329 11.495a3.681 3.681 0 0 1-2.224-.743c.292-.422.523-.89.681-1.39a2.197 2.197 0 1 0 0-3.128 5.176 5.176 0 0 0-.68-1.39 3.697 3.697 0 1 1 2.224 6.65ZM14.772 13.19c.25.247.474.505.674.767 1.35.026 2.318.357 3.022.808a4.418 4.418 0 0 1 1.556 1.752c.332.653.496 1.315.576 1.82a6.174 6.174 0 0 1 .072.758v.041l.748.013-.747-.013v.002a.75.75 0 0 0 1.5.024l-.745-.013.744.013v-.093a7.66 7.66 0 0 0-.09-.966 7.692 7.692 0 0 0-.72-2.266 5.915 5.915 0 0 0-2.085-2.335c-1.006-.645-2.317-1.047-4.003-1.047-.446 0-.865.028-1.26.081.271.202.524.42.758.653Z" />
      <path fill="currentColor" fillRule="evenodd" d="M5.132 7.799a3.697 3.697 0 1 1 7.394 0 3.697 3.697 0 0 1-7.394 0Zm3.697-2.197a2.197 2.197 0 1 0 0 4.393 2.197 2.197 0 0 0 0-4.393Z" clipRule="evenodd" />
      <path fill="currentColor" d="M3.375 19.137a.75.75 0 0 1-1.5.025l.75-.013-.75.013v-.031a3.454 3.454 0 0 1 .01-.281 7.691 7.691 0 0 1 .802-3.013 5.917 5.917 0 0 1 2.084-2.335c1.006-.645 2.316-1.047 4.003-1.047 1.686 0 2.997.402 4.003 1.047a5.916 5.916 0 0 1 2.084 2.335c.424.833.624 1.657.72 2.266a7.655 7.655 0 0 1 .09.966l.002.063v.028s0 .002-.745-.011l.744.013a.75.75 0 0 1-1.5-.024v-.002l.748.013-.748-.013v-.04a6.175 6.175 0 0 0-.072-.758 6.194 6.194 0 0 0-.576-1.821 4.418 4.418 0 0 0-1.557-1.752c-.733-.47-1.754-.81-3.193-.81-1.44 0-2.46.34-3.194.81a4.418 4.418 0 0 0-1.556 1.752 6.194 6.194 0 0 0-.577 1.82 6.16 6.16 0 0 0-.072.794v.006Z" />
    </svg>
  );
}

function IconWallet1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M5.75 3.25A2.25 2.25 0 0 0 3.5 5.5v13a2.25 2.25 0 0 0 2.25 2.25h13A2.25 2.25 0 0 0 21 18.5v-9a2.25 2.25 0 0 0-2.25-2.25h-.25V5.5a2.25 2.25 0 0 0-2.25-2.25H5.75Zm11.25 4H5V5.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v1.75ZM5 8.75h13.75a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75h-13A.75.75 0 0 1 5 18.5V8.75Z" />
    </svg>
  );
}

function IconSignsPost2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M13.152 3.346a.75.75 0 1 0-1.5 0v6h-5.09a1.75 1.75 0 0 0-1.162.442l-1.688 1.5a1.75 1.75 0 0 0 0 2.616l1.688 1.5c.32.284.734.442 1.163.442h5.09v6a.75.75 0 0 0 1.5 0v-11h5.091a1.75 1.75 0 0 0 1.163-.442l1.687-1.5a1.75 1.75 0 0 0 0-2.616l-1.687-1.5a1.75 1.75 0 0 0-1.163-.442h-5.092v-1Zm-1.5 7.5v3.5h-5.09a.25.25 0 0 1-.166-.063l-1.687-1.5a.25.25 0 0 1 0-.374l1.687-1.5a.25.25 0 0 1 .166-.063h5.09Zm1.501-5h5.091a.25.25 0 0 1 .166.063l1.688 1.5a.25.25 0 0 1 0 .374l-1.688 1.5a.25.25 0 0 1-.166.063h-5.09v-3.5Z" />
    </svg>
  );
}

function IconWebhooks(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M11.373 10.471c-1.938-.987-2.647-2.296-2.178-3.9.412-1.412 1.804-2.337 3.22-2.12.707.11 1.329.403 1.813.964.734.85.9 1.84.675 2.945l.67.184 1.004.277c.713-1.986-.124-4.306-1.95-5.497-1.9-1.24-4.363-.979-5.978.637-.843.843-1.304 1.873-1.411 3.064-.152 1.685.534 3.045 1.686 4.208l-1.832 3.12-.157.01c-.085.005-.15.009-.216.019-1.204.173-2.052 1.26-1.849 2.37.229 1.252 1.351 2.021 2.504 1.715 1.222-.325 1.872-1.523 1.411-2.754-.167-.445-.064-.73.145-1.081.59-.988 1.17-1.98 1.76-2.992l.683-1.169Zm4.147 1.493L13.749 8.79l.085-.212c.058-.143.111-.273.156-.407.234-.704.092-1.347-.353-1.918a2.015 2.015 0 0 0-2.303-.638c-.817.318-1.34 1.132-1.304 2.033.036.911.638 1.725 1.57 1.889.559.098.832.368 1.08.832.527.987 1.073 1.963 1.619 2.94l.647 1.16c1.829-1.238 3.342-1.199 4.472.091.979 1.118 1 2.82.048 3.962-1.116 1.338-2.618 1.392-4.337.261l-1.364 1.16c1.74 1.764 4.222 1.998 6.186.626 1.912-1.338 2.578-3.905 1.604-6.073-.806-1.794-3.054-3.47-6.035-2.533Zm-3.959 5.412h3.589c.05.068.097.135.142.2.096.137.186.266.292.381.76.826 2.043.866 2.856.1.842-.793.88-2.127.084-2.956-.779-.811-2.11-.889-2.832-.03-.44.522-.89.583-1.472.574a171.2 171.2 0 0 0-3.197-.01l-1.282.002c.097 2.133-.697 3.462-2.272 3.778-1.542.309-2.961-.49-3.461-1.948-.568-1.656.134-2.981 2.163-4.032l-.46-1.694c-2.211.49-3.87 2.669-3.699 5.12.151 2.164 1.87 4.086 3.972 4.43a4.724 4.724 0 0 0 3.21-.58c1.28-.738 2.023-1.898 2.367-3.335Z" clipRule="evenodd" />
    </svg>
  );
}

function IconSignalApp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="m9.637 2.292.221.91A8.823 8.823 0 0 0 7.385 4.24l-.474-.803a9.725 9.725 0 0 1 2.726-1.145Zm4.726 0-.222.91a8.823 8.823 0 0 1 2.474 1.038l.477-.803a9.725 9.725 0 0 0-2.73-1.145ZM3.57 6.831c-.512.86-.892 1.793-1.128 2.768l.895.225A9.115 9.115 0 0 1 4.36 7.312l-.79-.481Zm-.493 5.168c0-.454.033-.908.1-1.357l-.912-.141a10.19 10.19 0 0 0 0 2.997l.912-.141c-.067-.45-.1-.903-.1-1.358Zm14.011 8.562-.473-.803c-.768.47-1.6.821-2.47 1.039l.22.91a9.723 9.723 0 0 0 2.723-1.146Zm3.834-8.562c0 .455-.033.909-.1 1.358l.912.14c.148-.993.148-2.003 0-2.996l-.912.14c.067.45.1.904.1 1.358Zm.635 2.4-.895-.225a9.113 9.113 0 0 1-1.023 2.512l.79.485a10.05 10.05 0 0 0 1.128-2.772Zm-8.22 6.562a8.85 8.85 0 0 1-2.674 0l-.139.927a9.73 9.73 0 0 0 2.951 0l-.139-.927Zm5.845-3.586a9.03 9.03 0 0 1-1.89 1.919l.547.755a9.937 9.937 0 0 0 2.086-2.113l-.743-.56Zm-1.89-12.67a9.024 9.024 0 0 1 1.89 1.92l.743-.563a9.94 9.94 0 0 0-2.08-2.112l-.553.754ZM4.817 6.624a9.025 9.025 0 0 1 1.89-1.92l-.553-.755a9.938 9.938 0 0 0-2.08 2.112l.743.563Zm15.613.206-.79.481c.463.78.808 1.625 1.022 2.51l.895-.226a10.047 10.047 0 0 0-1.127-2.765Zm-9.767-3.792a8.849 8.849 0 0 1 2.673 0l.139-.927a9.73 9.73 0 0 0-2.95 0l.138.927ZM5.29 20.297l-1.906.451.445-1.935-.899-.214-.444 1.936a.951.951 0 0 0 .246.876.92.92 0 0 0 .863.25l1.904-.444-.209-.92Zm-2.168-2.534.899.212.308-1.342a9.102 9.102 0 0 1-.993-2.459l-.895.225c.2.829.506 1.627.908 2.376l-.227.988Zm4.308 2.03-1.322.313.21.913.972-.23a9.686 9.686 0 0 0 2.34.922l.221-.91a8.814 8.814 0 0 1-2.415-1.013l-.006.006ZM12 3.876c-1.43 0-2.833.39-4.063 1.128A8.068 8.068 0 0 0 5 8.071a8.226 8.226 0 0 0 .23 8.251l-.77 3.333 3.282-.781a7.885 7.885 0 0 0 7.111.717 7.993 7.993 0 0 0 3.04-2.092 8.158 8.158 0 0 0 1.799-3.25 8.248 8.248 0 0 0 .18-3.724 8.188 8.188 0 0 0-1.477-3.413 8.03 8.03 0 0 0-2.822-2.385A7.899 7.899 0 0 0 12 3.875Z" />
    </svg>
  );
}

function IconXmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M6.22 7.28a.75.75 0 0 1 1.06-1.06L12 10.938l4.719-4.718a.75.75 0 1 1 1.06 1.06L13.06 12l4.718 4.719a.75.75 0 1 1-1.06 1.06l-4.719-4.718-4.719 4.718a.75.75 0 1 1-1.06-1.06l4.718-4.719L6.22 7.28Z" />
    </svg>
  );
}

function IconXmarkCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path fill="currentColor" d="M8.784 8.784a.75.75 0 0 0 0 1.06L10.939 12l-2.155 2.155a.75.75 0 0 0 1.06 1.06L12 13.062l2.156 2.155a.75.75 0 0 0 1.06-1.06L13.06 12l2.155-2.155a.75.75 0 1 0-1.06-1.06L12 10.938 9.843 8.784a.75.75 0 0 0-1.06 0Z" />
      <path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM3.5 12a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0Z" clipRule="evenodd" />
    </svg>
  );
}

function IconBolt2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" width="1em" height="1em" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M6.677 3.093A.75.75 0 0 1 7.41 2.5h7.28a.75.75 0 0 1 .678 1.069l-2.18 4.646h5.652a.75.75 0 0 1 .635 1.149l-8.029 12.785a.75.75 0 0 1-1.382-.464l.62-7.15H5.16a.75.75 0 0 1-.733-.906l2.25-10.536ZM8.017 4l-1.93 9.035h5.415a.75.75 0 0 1 .747.815l-.423 4.873 5.657-9.008h-5.476a.75.75 0 0 1-.679-1.069L13.508 4H8.018Z" clipRule="evenodd" />
    </svg>
  );
}

function IconWhatsapp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="M19.074 4.894A9.932 9.932 0 0 0 12.064 2C6.598 2 2.13 6.437 2.13 11.903c0 1.769.45 3.441 1.318 4.984L2.032 22l5.306-1.35c1.447.771 3.087 1.221 4.759 1.221 5.434-.032 9.87-4.47 9.87-9.967 0-2.637-1.028-5.113-2.893-7.01Zm-7.042 15.273a8.18 8.18 0 0 1-4.212-1.19l-.322-.192-3.119.803.869-3.022-.193-.322A8.534 8.534 0 0 1 3.8 11.84c0-4.534 3.665-8.2 8.231-8.2 2.187 0 4.245.869 5.788 2.412a8.245 8.245 0 0 1 2.412 5.852c.064 4.599-3.666 8.264-8.2 8.264Zm4.534-6.173c-.257-.129-1.447-.74-1.736-.772-.225-.097-.418-.129-.547.129-.129.257-.643.771-.772.964-.128.129-.257.193-.546.032-.258-.128-1.03-.353-1.994-1.254-.74-.643-1.254-1.447-1.35-1.736-.129-.257-.033-.354.128-.515.129-.128.258-.257.354-.45.129-.128.129-.257.257-.418.129-.128.032-.321-.032-.45-.096-.128-.547-1.35-.772-1.865-.193-.514-.418-.418-.546-.418h-.45c-.13 0-.45.032-.644.322-.225.257-.868.868-.868 2.09s.868 2.347 1.03 2.572c.128.129 1.768 2.669 4.212 3.762.578.257 1.028.418 1.414.547.579.193 1.126.128 1.544.096.482-.032 1.447-.579 1.672-1.19.193-.546.193-1.093.128-1.19-.064-.063-.257-.16-.482-.256Z"
      />
    </svg>
  );
}

function IconMonitorMac(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
      <path
        fill="currentColor"
        d="M2 5.701a2.25 2.25 0 0 1 2.25-2.25h15.5A2.25 2.25 0 0 1 22 5.701V15.287a2.25 2.25 0 0 1-2.25 2.25h-5.5v1.512h1a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h1v-1.512h-5.5A2.25 2.25 0 0 1 2 15.287V5.7ZM12.75 19.05v-1.512h-1.5v1.512h1.5Zm1.5-3.012h5.5a.75.75 0 0 0 .75-.75V13.45h-17v1.836c0 .414.336.75.75.75h5.5v-.01h1.5v.01h1.5v-.01h1.5v.01ZM20.5 5.7a.75.75 0 0 0-.75-.75H4.25a.75.75 0 0 0-.75.75v6.25h17v-6.25Z"
      />
    </svg>
  );
}

// ---- aliases com o nome que o lucide-react usava ----

/// Ícone do monitor de tela (MonitorMac) — usado pra representar as Ilhas de
/// Atendimento (monitoramento em tempo real).
export const MonitorMac = IconMonitorMac;
/// Sem triângulo de alerta no plano gratuito — usa o círculo de informação.
export const AlertTriangle = IconInfo;
/// Logo do WhatsApp — usado especificamente no menu de "WhatsApp Channel".
export const Whatsapp = IconWhatsapp;
export const ArrowLeft = IconArrowLeft;
export const ArrowRight = IconArrowRight;
/// Sem ícone de "selo verificado" — usa o check circular.
export const BadgeCheck = IconCheckCircle1;
export const BarChart3 = IconBarChart4;
/// Sem robô/IA no plano gratuito — lâmpada representa "inteligente".
export const Bot = IconBulb2;
export const BrainCircuit = IconBulb4;
export const Building2 = IconBuildings1;
export const Calendar = IconCalendarDays;
export const CalendarIcon = IconCalendarDays;
export const Check = IconCheck;
export const CheckCircle2 = IconCheckCircle1;
export const CheckIcon = IconCheck;
export const ChevronDown = IconChevronDown;
export const ChevronDownIcon = IconChevronDown;
/// Sem chevron simples pra direita no plano gratuito (só a versão circular) — usa seta reta nos dois lados (ChevronLeft/ChevronRight) pra manter os pares (paginação, carrossel) consistentes entre si.
export const ChevronLeft = IconArrowLeft;
export const ChevronRight = IconArrowRight;
export const ChevronUpIcon = IconChevronUp;
export const ChevronsLeft = IconAngleDoubleLeft;
export const ChevronsRight = IconAngleDoubleRight;
/// Sem círculo vazio — usa o círculo com traço (estado "não concluído").
export const Circle = IconMinusCircle;
export const Clock = IconStopwatch;
export const Contact = IconTargetUser;
/// Sem ícone de cookie — usa o círculo de informação.
export const Cookie = IconInfo;
export const Copy = IconClipboard;
export const Download = IconDownload1;
export const Eye = IconEye;
/// Sem "olho riscado" no plano gratuito — reaproveita o mesmo olho (o toggle de mostrar/ocultar senha perde a distinção visual entre os dois estados).
export const EyeOff = IconEye;
export const FileSpreadsheet = IconFileMultiple;
export const FileText = IconNotebook1;
export const Gauge = IconGauge1;
export const Headphones = IconHeadphone1;
export const Headset = IconServiceBell1;
export const Hourglass = IconHourglass;
export const IdCard = IconIdCard;
export const KeyRound = IconKey1;
export const ListChecks = IconCheckSquare2;
export const Loader2 = IconSpinner3;
export const Lock = IconLocked1;
export const LogIn = IconEnter;
export const LogOut = IconExit;
export const Mail = IconEnvelope1;
export const MailCheck = IconEnvelope1;
export const Megaphone = IconMegaphone1;
export const MessageCircle = IconChatBubble2;
export const MessageCircleMore = IconMessage2;
export const MessageSquare = IconMessage3Text;
export const MessageSquareText = IconComment1Text;
export const Minus = IconMinus;
/// Sem "3 pontos verticais" — usa o ícone de menu "meatballs" (mais opções).
export const MoreVertical = IconMenuMeatballs2;
export const Network = IconVectorNodes6;
export const Pencil = IconPencil1;
export const Phone = IconPhone;
export const PhoneCall = IconTelephone3;
export const Plug = IconPlug1;
export const Plus = IconPlus;
/// Sem "desfazer" anti-horário — usa o refresh circular (mais próximo).
export const RotateCcw = IconRefreshCircle1Clockwise;
export const Search = IconSearch1;
/// Sem avião de papel (send) no plano gratuito — usa a seta de localização.
export const Send = IconLocationArrowRight;
export const ShieldCheck = IconShield2Check;
export const SlidersHorizontal = IconSlidersHorizontalSquare2;
export const Sparkles = IconStarFat;
/// Sem ícone de etiqueta genérico — usa a etiqueta de preço/valor.
export const Tag = IconLabelDollar2;
export const Ticket = IconTicket1;
export const Trash2 = IconTrash3;
export const Upload = IconUpload1;
export const User = IconUser4;
export const UserCheck = IconUser4;
export const UserRound = IconUser4;
export const Users = IconUserMultiple4;
export const UsersRound = IconUserMultiple4;
export const Wallet = IconWallet1;
/// Sem ícone de "waypoints/rota" — usa a placa de sinalização.
export const Waypoints = IconSignsPost2;
export const Webhook = IconWebhooks;
export const Wifi = IconSignalApp;
export const X = IconXmark;
export const XCircle = IconXmarkCircle;
export const Zap = IconBolt2;
