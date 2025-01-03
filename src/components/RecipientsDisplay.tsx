import React, { RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface RecipientsDisplayProps {
  recipients: string[];
}

const Container = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 4px;
  minwidth: 100%;
`;
const StyledRecipient = styled.label`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333333;
  width: 100%;
`;
const StyledCount = styled.span`
  background-color: #666666;
  padding: 2px 5px;
  color: #f0f0f0;
  border-radius: 3px;
  display: flex;
  align-items: center;
`;
function RecipientsDisplay({ recipients }: RecipientsDisplayProps) {
  const recipientsRef = useRef<HTMLLabelElement>(null);
  let remainingCount: number = 0;
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const recipientSpan = recipientsRef.current;
      if (recipientSpan) {
        const tempSpan = document.createElement("span");
        tempSpan.textContent = ", ... ";
        tempSpan.style.visibility = "hidden";
        document.body.appendChild(tempSpan);
        let wordWidth = tempSpan.offsetWidth;
        const width =
          Math.round(recipientSpan.getBoundingClientRect().width) - wordWidth;
        console.log("check width of container");
        //wordWidth is for , ...fdafdfafd
        //console.log("check container width for recep", Math.round(recipientSpan.getBoundingClientRect().width), tempSpan.offsetWidth, width)
        document.body.removeChild(tempSpan);
        setContainerWidth(width);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const displayRecipient = (recipients: string[]) => {
    let filterEmail: string = "";

    if (recipients.length === 1) {
      filterEmail = recipients[0];
    } else if (recipients.length > 1) {
      let wordsThatFitArray = "";
      remainingCount = 0;
      recipients.forEach((item: string, index: number) => {
        const tempSpan = document.createElement("span");
        tempSpan.textContent =
          wordsThatFitArray !== "" ? wordsThatFitArray + ", " + item : item;
        tempSpan.style.visibility = "hidden";
        document.body.appendChild(tempSpan);
        let wordWidth = tempSpan.offsetWidth;
        //console.log("checking previous string width", item, index, wordWidth, containerWidth, recipients.length)
        if (wordWidth <= containerWidth) {
          if (wordsThatFitArray !== "") {
            wordsThatFitArray = wordsThatFitArray + ", " + item;
          } else {
            wordsThatFitArray = item;
          }
        } else {
          if (index === 0) {
            wordsThatFitArray = item;
          } else {
            remainingCount++;
          }
        }
        document.body.removeChild(tempSpan);
      });

      filterEmail = wordsThatFitArray + (remainingCount > 0 ? ", ... " : "");
    }

    return filterEmail;
  };

  return (
    <Container id="recipientId">
      <StyledRecipient ref={recipientsRef}>
        {displayRecipient(recipients)}
      </StyledRecipient>{" "}
      {remainingCount > 0 && <StyledCount>+{remainingCount}</StyledCount>}
    </Container>
  );
}

export default RecipientsDisplay;
