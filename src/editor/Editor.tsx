import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import { Node, Editor, Transforms, Range, createEditor } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
} from "slate-react";

import { Portal } from "./Component";
import "./editor.scss";

const MentionExample = () => {
  const ref = useRef<any>();
  const [value, setValue] = useState<Node[]>(initialValue);
  const [target, setTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [chars, setChars] = useState<any>([]);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );

  const onKeyDown = useCallback(
    (event) => {
      if (target) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index].value);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [index, search, target]
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el: any = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  return (
    <div className="row editor">
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch =
              (beforeText && beforeText.match(/^@(\w+)$/)) ||
              (beforeText && beforeText.match(/^#(\w+)$/));
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              const filterData: any =
                beforeText && beforeText.match(/^#(\w+)$/)
                  ? ValueSets
                  : Functions;
              const suggestionList = filterData.filter((c) =>
                c.name.toLowerCase().startsWith(beforeMatch[1].toLowerCase())
              );
              console.log(suggestionList);
              setChars(suggestionList);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }
          setTarget(null);
        }}
      >
        <Editable
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          placeholder="Enter some text..."
        />
        {target && chars.length > 0 && (
          <Portal>
            <div
              ref={ref}
              style={{
                top: "-9999px",
                left: "-9999px",
                position: "absolute",
                zIndex: 1,
                padding: "10px 0px",
                background: "white",
                borderRadius: "4px",
                boxShadow: "0 1px 5px rgba(0,0,0,.2)",
              }}
            >
              {chars.map((char: any, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1px 3px",
                    borderRadius: "3px",
                    background: i === index ? "#B4D5FF" : "transparent",
                  }}
                >
                  {char.name}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </Slate>
    </div>
  );
};

const withMentions = (editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  return editor;
};

const insertMention = (editor, character: any) => {
  console.log(character);
  const mention = { type: "mention", character, children: [{ text: "" }] };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "mention":
      return <MentionElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const MentionElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      contentEditable={false}
      style={{
        padding: "3px 3px 2px",
        margin: "0 1px",
        borderRadius: "4px",
        fontSize: "30px",
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      {element.character}
    </span>
  );
};

const initialValue = [
  {
    children: [
      {
        text:
          "This example shows how you might implement a simple @-mentions feature that lets users autocomplete mentioning a user by their username. Which, in this case means Star Wars characters. The mentions are rendered as void inline elements inside the document.",
      },
    ],
  },
  {
    children: [
      { text: "Try mentioning characters, like " },
      {
        type: "mention",
        character: "R2-D2",
        children: [{ text: "" }],
      },
      { text: " or " },
      {
        type: "mention",
        character: "Mace Windu",
        children: [{ text: "" }],
      },
      { text: "!" },
    ],
  },
];

const ValueSets = [
  {
    name: "Value Sets",
    value: "Value Sets - runAt - to - from",
  },
  {
    name: "Value Sets 1",
    value: "Value Sets 1 - runAt - to - from",
  },
  {
    name: "Value Sets 2",
    value: "Value Sets 2 - runAt - to - from",
  },
];

const Functions = [
  {
    name: "Age Between",
    value: "Aayla Secura - runAt - to - from",
  },
  {
    name: "Age Between 1",
    value: "Age Between 1 - runAt - to - from",
  },
  {
    name: "Age Between 2",
    value: "Age Between 2 - runAt - to - from",
  },
  {
    name: "CPvD2",
    value: "Aayla Secura - runAt - to - from",
  },
  {
    name: "Diagnosis",
    value: "Aayla Secura - runAt - to - from",
  },
];

export default MentionExample;
