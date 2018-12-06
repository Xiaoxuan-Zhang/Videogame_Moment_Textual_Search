import xml.etree.ElementTree as ET


def parse_time(str_ms):
    total_ms = int(str_ms)
    ms = total_ms % 1000
    total_s = int(total_ms / 1000)
    s = total_s % 60
    total_m = int(total_s / 60)
    m = total_m % 60
    h = int(total_m / 60)

    # print(str_ms, ' to:', h, m, s, ms)
    return total_ms, h, m, s, ms


def parse_end_time(str_ms_start, str_ms_duration):
    return parse_time(int(str_ms_start) + int(str_ms_duration))


class VttLine:
    def __init__(self, start, stop, text):
        self.start = start
        self.end = stop
        self.text = text.strip()

    def __str__(self):
        return '%s %s %s' % (self.start, self.end, self.text)


def parse_subtitle_xml(filename):
    tree = ET.parse(filename)
    root = tree.getroot()

    count = 0
    # last_start_ms = 0
    last_end_time = [-1, 0, 0, 0, 0]
    all_lines = []
    for p in root.findall('body/p'):
        # skip 0 duration
        if 'd' not in p.attrib:
            continue

        text = ''
        for s in p.findall('s'):
            text += s.text

        # skip empty sentences
        text = text.strip()
        if len(text) == 0 or text == '[Music]':
            continue

        # parse timing
        start_time = parse_time(p.attrib['t'])
        end_time = parse_end_time(p.attrib['t'], p.attrib['d'])

        # print(start_time, end_time, text)
        # update last record if it's part of previous sentence
        if start_time[0] <= last_end_time[0]:
            all_lines[-1]['end_time'] = start_time

        # record another session with empty subtitle if span > 10ms, for segmenting
        if start_time[0] - last_end_time[0] > 10:
            all_lines.append({'line_id': count, 'start_time': last_end_time, 'end_time': start_time, 'text': ''})
            count += 1

        all_lines.append({'line_id': count, 'start_time': start_time, 'end_time': end_time, 'text': text})

        # last_start_ms = start_time[0]
        last_end_time = end_time

        # add line id
        count += 1

    output = []
    for line in all_lines:
        # output.append('%02d:%02d:%02d.%03d %02d:%02d:%02d.%03d %s\n' %
        #               (line['start_time'][1], line['start_time'][2], line['start_time'][3], line['start_time'][4],
        #                line['end_time'][1], line['end_time'][2], line['end_time'][3], line['end_time'][4],
        #                line['text']))

        start_time_str = '%02d:%02d:%02d.%03d' % (line['start_time'][1], line['start_time'][2], line['start_time'][3], line['start_time'][4])
        stop_time_str = '%02d:%02d:%02d.%03d' % (line['end_time'][1], line['end_time'][2], line['end_time'][3], line['end_time'][4])
        output.append(VttLine(start_time_str, stop_time_str, line['text']))

    return output

if __name__ == '__main__':
    lines = parse_subtitle_xml('./Subtitles/EP1.pretty.xml')

    out_file = './EP1.vtt.txt'
    f = open(out_file, 'w+')
    for line in lines:
        f.write(str(line))
        f.write('\n')
    f.close()
