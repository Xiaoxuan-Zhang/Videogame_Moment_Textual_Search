import json
import math

class Evaluation_MRR:
    def __init__(self, database_file):
        with open(database_file, 'r') as f:
            self.database = json.loads(f.read())
            self.fps = dict()
            for file_id, data in self.database.items():
                self.fps[file_id] = data['video_fps']
        return

    def frame_index(self, fps, time):
        return int(fps * time)

    def to_milliseconds(self, time_str):
        time_tokens = time_str.split(':')
        mSec = int(time_tokens[0]) * 3600 + int(time_tokens[1]) * 60 + int(time_tokens[2])
        return mSec

    def valid_answer(self, file_id, frame_id, answer_list):
        hit = False
        for answer in answer_list:
            video_id = answer['video_id']
            frame_start = self.frame_index(self.fps[file_id], self.to_milliseconds(answer['timeslot'][0]))
            frame_stop = self.frame_index(self.fps[file_id], self.to_milliseconds(answer['timeslot'][1]))
            # print(
            #     f'results:(file_id={file_id}, frame_id={frame_id}),answers:(video_id={video_id},frame_range=({frame_start}, {frame_stop}) )')
            if int(file_id) == int(video_id) and (frame_start <= int(frame_id) <= frame_stop):
                hit = True
        return hit

    def reciprocal_rank(self, answer_data, rst_data):
        rank = 0
        for rst_idx in range(len(rst_data)):
            data = rst_data[rst_idx]
            file_id = data['file_id']
            frame_id = data['frame_id']
            if self.valid_answer(file_id, frame_id, answer_data):
                print(f'******Hit! Found an answer at rank {rst_idx}!******')
                rank = rst_idx + 1
                break

        if rank > 0:
            rank = 1 / rank
        return rank

    def evaluation_mean_rec_rank(self, result_file, answer_file, rank=10):
        json_file = open(result_file)
        result_data = json.loads(json_file.read())

        json_file = open(answer_file)
        answer_data = json.loads(json_file.read())
        print("number of results:", len(result_data.keys()))

        rank_sum = 0
        for query, results in result_data.items():
            print(f'query: {query}')
            if query in answer_data.keys():
                answer_list = answer_data[query]
                rank_sum += self.reciprocal_rank(answer_list, results[:rank])

        mean_rank = rank_sum / len(result_data.keys())
        return mean_rank


class Evaluation_nDCG:
    def __init__(self, database_file):
        with open(database_file, 'r') as f:
            self.database = json.loads(f.read())
            self.fps = dict()
            for file_id, data in self.database.items():
                self.fps[file_id] = data['video_fps']
        return

    def frame_index(self, fps, time):
        return int(fps * time)

    def to_milliseconds(self, time_str):
        time_tokens = time_str.split(':')
        mSec = int(time_tokens[0]) * 3600 + int(time_tokens[1]) * 60 + int(time_tokens[2])
        return mSec

    def valid_answer(self, file_id, frame_id, answer_list):
        hit = False
        for answer in answer_list:
            video_id = answer['video_id']
            frame_start = self.frame_index(self.fps[file_id], self.to_milliseconds(answer['timeslot'][0]))
            frame_stop = self.frame_index(self.fps[file_id], self.to_milliseconds(answer['timeslot'][1]))
            # print(f'results:(file_id={file_id}, frame_id={frame_id}),answers:(video_id={video_id},frame_range=({frame_start}, {frame_stop}) )')
            if int(file_id) == int(video_id) and (frame_start <= int(frame_id) <= frame_stop):
                hit = True
        return hit

    # Discounted Cumulative Gain
    def calc_nDCG(self, answer_data, rst_data, rank_pos):
        DCG = 0
        IDCG = 0
        nDCG = 0
        rst_dir = {}
        for n in range(len(rst_data)):
            data = rst_data[n]
            file_id = data['file_id']
            frame_id = data['frame_id']
            if self.valid_answer(file_id, frame_id, answer_data):
                rst_dir[n] = 1  # The relevancy will always be binary 0 or 1
                if n <= rank_pos:
                    print(f'******Hit! Found an answer at rank {n+1}!******')
            else:
                rst_dir[n] = 0

        # calculate DCG
        DCG = sum([rel / math.log2(rank + 2) for rank, rel in rst_dir.items()][:rank_pos])

        # Calculate IDCG
        order_lst = sorted(rst_dir.values(), reverse=True)
        IDCG = sum([rel / math.log2(rank + 2) for rank, rel in enumerate(order_lst)][:rank_pos])
        print(f"DCG={DCG}, IDCG={IDCG}")

        if IDCG != 0:
            nDCG = DCG / IDCG
        return nDCG

    def evaluation_mean_nDCG(self, result_file, answer_file, rank_pos=10):
        json_file = open(result_file)
        result_data = json.loads(json_file.read())
        json_file = open(answer_file)
        answer_data = json.loads(json_file.read())

        sum_nDCG = 0
        for query, results in result_data.items():
            print(f'query: {query}')
            if query in answer_data.keys():
                answer_list = answer_data[query]
                sum_nDCG += self.calc_nDCG(answer_list, results, rank_pos)
        mean_nDCG = sum_nDCG / len(result_data.keys())
        return mean_nDCG
