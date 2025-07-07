import React, { ReactNode } from "react"
import { Translator as Translate } from "@miracleufo/react-g-translator"

export const Translator = ({ children }: { children: ReactNode }) => {
  return (
    <Translate from="en" to="ig">
      <div>{"Hello world"}</div>
    </Translate>
  )
}
