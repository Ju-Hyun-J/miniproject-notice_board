package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Board;
import org.example.backend.repository.BoardRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardRepository boardRepository;

    // 목록 조회
    @GetMapping()
    public List<Board> getBoards() {
        return boardRepository.findAll();
    }

    // 등록
    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        return boardRepository.save(board);
    }
}
