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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const MentionExample = () => {
  const ref = useRef<any>();
  const [value, setValue] = useState<Node[]>(initialValue);
  const [target, setTarget] = useState<Range | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [chars, setChars] = useState<any>([]);
  const [deserializeValue, setdeserializeValue] = useState("");
  const [state, setState] = React.useState(false);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );

  const handleChange = (event) => {
    setState(!state);
  };


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
            Editor.insertBreak(editor);
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index] && chars[index].value ? chars[index].value : '');
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
    if (target) {
      const el: any = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 30}px`;
      el.style.left = `${rect.left + window.pageXOffset + 15}px`;
    }
  }, [chars.length, editor, index, search, target]);


  const onSave = () => {
    const str = JSON.stringify(value);
    let val = value.map(n => Node.string(n)).join('\n');
    const deSerialize = JSON.parse(str);
    console.log(deSerialize);
    setdeserializeValue(val);
  }

  return (
    <div className="row rule-editor">
      <div className="row m-0 w-100">
        <h4 className="col p-0 text-left"> Rule Editor</h4>
        <div className="col-10 p-0 text-right">
          <FormControlLabel
            control={
              <Switch
                checked={state}
                onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </div>
      </div>
      <div className="row editor m-0 w-100" style={{ backgroundColor: state ? "#38383d" : "#fff", color: state ? "#fff" : "#38383d" }}>
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => {
            setValue(value);
            console.log(editor);
            const { selection } = editor;
            if (selection && Range.isCollapsed(selection)) {
              const [start] = Range.edges(selection);
              const wordBefore = Editor.before(editor, start, {unit: "word"});
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
              console.log(beforeMatch)
              if (beforeMatch && afterMatch) {
                setTarget(beforeRange);
                const filterData: any =
                  beforeText && beforeText && beforeText.match(/^#(\w+)$/)
                    ? ValueSets
                    : Functions;
                const suggestionList = filterData.filter((c) =>
                  c.name.toLowerCase().startsWith(beforeMatch[1] ? beforeMatch[1].toLowerCase() : '')
                );
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
            placeholder="Enter rule definition ..."
          />
          {target && (
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
                  width: 300,
                  height: 200,
                  borderRadius: "2px",
                  boxShadow: "0 1px 5px rgba(0,0,0,.2)",
                }}
              >
                {chars.map((char: any, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1px 3px",
                      background: i === index ? "#ccc" : "transparent",
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
      <button type="submit" className="btn btn-primary mt-3" onClick={onSave}>Submit</button>
      <div className="row m-0 w-100">
        <h6>
          {deserializeValue}
        </h6>
      </div>

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
  const mention = { type: "custom", character, children: [{ text: character }] };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "custom":
      return <span {...attributes}>{children}</span>
    default:
      return <span {...attributes}>{children}</span>;
  }
};

// const MentionElement = ({ attributes, children, element }) => {
//   const selected = useSelected();
//   const focused = useFocused();
//   return (
//       <span
//         contentEditable={true}
//         suppressContentEditableWarning={true}
//         style={{
//           padding: "3px 3px 2px",
//           margin: "0 1px",
//           borderRadius: "4px",
//           fontSize: "30px",
//         }}
//       >
//         {element.character}
//       </span>
//   );
// };



const initialValue = [
  {
    children: [
      {
        text:
          "",
      },
    ],
  }
];

const ValueSets = [
  {
    name: "Serum Creatinine",
    value: '"HEDIS.Serum_Creatinine"',
  },
  {
    name: "Nonacute_Inpatient",
    value: '"HEDIS.Nonacute_Inpatient"',
  },
  {
    name: "Acute_Inpatient",
    value: '"HEDIS.Acute_Inpatient"',
  },
];

const Functions = [
  {
    name: "ageBetween",
    value: "age between condition1 and condition2 on runDate",
  },
  {
    name: "has",
    value: 'has condition1 from runDate-12 to runDate',
  },
  {
    name: "hasWith",
    value: 'has condition1 with condition2 from runDate-12 to runDate',
  },
  {
    name: "hasChronicCondition",
    value: 'has chronic condition condition1 between runDate-24 months and runDate',
  },
  {
    name: "enrolled",
    value: 'continousEnrollment coverageTypes from runDate-12 to runDate with gaps and maxAllowedGap days',
  }
];

export default MentionExample;
