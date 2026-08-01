import { theme } from '@/constants/theme';
import React, { RefObject } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const RichTextEditor = ({
    editorRef, onChange
}: {
    editorRef: RefObject<RichEditor | null>;
    onChange: () => void;
}) => {
    return (
        <View style={
            { minHeight: 285 }
        }>
            <RichToolbar actions={[
                actions.setStrikethrough,
                actions.removeFormat,
                actions.setBold,
                actions.setItalic,
                actions.insertOrderedList,
                actions.blockquote,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.code,
                actions.line,
                actions.heading1,
                actions.heading4,
            ]}
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>,
                    [actions.heading4]: ({ tintColor }) => <Text style={{ color: tintColor }}>H4</Text>
                }}
                style={styles.richBar}
                flatContainerStyle={styles.flatStyle}
                seletedIconTint={theme.colors.primaryDark}
                editor={editorRef}
                disable={false}
            />

            <RichEditor ref={editorRef}
                containerStyle={styles.rich}
                placeholder="what's on your mind?"
                editorStyle={{
                    backgroundColor: '#fff',
                    color: theme.colors.textDark,
                    placeholderColor: 'gray',
                }} onChange={onChange}
            />

        </View >
    )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray,
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        padding: 5,
    },
    flatStyle: {
        paddingHorizontal: 20,
        gap: 3,
    }
});